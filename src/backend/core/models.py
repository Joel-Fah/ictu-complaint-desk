import datetime
import os
from datetime import timedelta

from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.core.exceptions import ValidationError
from django.db import models
from enum import Enum
from django.contrib.auth import get_user_model
from rest_framework.exceptions import ValidationError
import mimetypes
from django.utils import timezone
from slugify import slugify

from core.utils import get_current_year


# Create your models here.
class UserRole(str, Enum):
    STUDENT = 'Student'
    LECTURER = 'Lecturer'
    ADMIN = "Admin"
    COMPLAINT_COORDINATOR = 'Complaint Coordinator'

    @classmethod
    def choices(cls):
        return [(tag.name, tag.value) for tag in cls]


class OfficeChoices(str, Enum):
    FINANCE_DEPARTMENT = "Finance Department"
    CISCO_LAB = "Cisco Lab"
    REGISTRAR_OFFICE = "Registrar Office"
    FACULTY = "Faculty"
    OTHER = "Other"

    @classmethod
    def choices(cls):
        return [(choice.name, choice.value) for choice in cls]


class FacultyChoices(models.TextChoices):
    ICT = 'ICT', 'ICT'
    BMS = 'BMS', 'BMS'
    BOTH = 'BOTH', 'Both ICT and BMS'


class SemesterChoices(models.TextChoices):
    FALL = "Fall", "Fall"
    SPRING = "Spring", "Spring"
    SUMMER = "Summer", "Summer"


class CustomUserManager(BaseUserManager):
    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', UserRole.ADMIN)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(username, email, password, **extra_fields)


class CustomUser(AbstractUser):
    role = models.CharField(
        max_length=100,
        choices=UserRole.choices,
        default=UserRole.STUDENT,
        help_text="Role of the user in the system",
    )

    secondary_role = models.CharField(
        max_length=100,
        choices=UserRole.choices,
        blank=True,
        null=True,
        help_text="Optional second role for users with multiple roles"
    )

    def clean(self):
        super().clean()
        if self.role and self.secondary_role and self.role == self.secondary_role:
            raise ValidationError("Primary and secondary roles cannot be the same.")


class StudentProfile(models.Model):
    user = models.OneToOneField(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='studentprofile'
    )

    student_number = models.CharField(
        max_length=12,
        blank=True,
        null=True,
    )

    def __str__(self):
        return f"Student Profile of {self.user.username}"

    def is_student(self):
        return self.user.role == UserRole.STUDENT


class AdminProfile(models.Model):
    user = models.OneToOneField(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='adminprofile'
    )

    office = models.CharField(
        max_length=50,
        choices=OfficeChoices.choices(),
        blank=False,
        null=False
    )

    function = models.CharField(
        max_length=100,
        blank=False,
        null=False
    )

    faculty = models.CharField(
        max_length=100,
        choices=FacultyChoices.choices,
        blank=False,
        null=False
    )

    course_file = models.FileField(
        upload_to='course_files/%Y/%m/%d/',
        verbose_name='Course File',
        help_text='File containing course information',
        null=True,
        blank=True
    )

    admin_file = models.FileField(
        upload_to='admin_files/%Y/%m/%d/',
        verbose_name='Admin File',
        help_text='File containing admin information',
        null=True,
        blank=True
    )

    @staticmethod
    def get_semester_and_year(date: datetime):
        month = date.month
        year = date.year
        if 10 <= month or month <= 3:
            # October to December or January to March: Fall
            semester = 'fall'
            # If Jan-Mar, use previous year for Fall
            if month <= 3:
                year -= 1
        elif 4 <= month <= 7:
            semester = 'spring'
        elif 8 <= month <= 9:
            semester = 'summer'
        else:
            raise ValueError("Invalid month for semester calculation.")
        return semester, year

    def save(self, *args, **kwargs):
        # Only Complaint Coordinator can set course_file and admin_file
        if self.user.role != UserRole.COMPLAINT_COORDINATOR:
            self.course_file = None
            self.admin_file = None

        # Get current date for semester/year calculation
        now = datetime.datetime.now()
        semester, year = self.get_semester_and_year(now)

        def rename_file(field):
            file_field = getattr(self, field)
            if file_field and hasattr(file_field, 'name') and file_field.name:
                base, ext = os.path.splitext(os.path.basename(file_field.name))
                new_name = f"{base}_{semester}{year}_{ext}"
                file_field.name = os.path.join(os.path.dirname(file_field.name), new_name)

        # Only rename if user is Complaint Coordinator
        if self.user.role == UserRole.COMPLAINT_COORDINATOR:
            rename_file('course_file')
            rename_file('admin_file')

        super().save(*args, **kwargs)

    def __str__(self):
        return f"Admin Profile of {self.user.username}"

    def is_admin(self):
        return self.user.role == UserRole.ADMIN or self.user.role == UserRole.COMPLAINT_COORDINATOR


class LecturerProfile(models.Model):
    user = models.OneToOneField(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='lecturerprofile'
    )

    def __str__(self):
        return f"Lecturer Profile of {self.user.username}"

    def is_lecturer(self):
        return self.user.role == UserRole.LECTURER


class Course(models.Model):
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['lecturer', 'code', 'semester', 'year'],
                name='unique_course_per_lecturer'
            )
        ]

    code = models.CharField(
        max_length=7,
        unique=True,
        blank=False,
        null=False
    )

    title = models.CharField(
        max_length=255,
        blank=False,
        null=False
    )

    semester = models.CharField(
        max_length=255,
        choices=SemesterChoices.choices,
        blank=False,
        null=False
    )

    year = models.PositiveIntegerField(
        default=get_current_year()
    )

    lecturer = models.ForeignKey(
        LecturerProfile,
        on_delete=models.CASCADE,
        related_name='courses',
    )

    faculty = models.CharField(
        max_length=100,
        choices=FacultyChoices.choices,
        blank=False,
        null=False
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Created At",
        help_text="Date and time when the course was created"
    )

    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Updated At",
        help_text="Date and time when the course was updated"
    )

    def __str__(self):
        return f"{self.code} - {self.title} ({self.semester} {self.year})"


class Complaint(models.Model):
    """
        Model representing a Complaint
    """

    class Meta:
        verbose_name = "Complaint"
        verbose_name_plural = "Complaints"

    class ComplaintTypeChoices(models.TextChoices):
        PRIVATE = "Private", "Private"
        COMMUNITY = "Community", "Community"

    class StatusChoices(models.TextChoices):
        OPEN = "Open", "Open"
        IN_PROGRESS = "In Progress", "In Progress"
        RESOLVED = "Resolved", "Resolved"
        ESCALATED = "Escalated", "Escalated"

    student = models.ForeignKey(
        get_user_model(),
        on_delete=models.CASCADE,
        related_name="complaints",
        limit_choices_to={'role': 'Student'},
        verbose_name="Student",
        help_text="The student who submitted the complaint",
    )

    title = models.CharField(
        max_length=255,
        verbose_name="Title",
        help_text="Title of the complaint",
        blank=False, null=False
    )

    slug = models.SlugField(
        max_length=255,
        unique=False,
        verbose_name="Category Slug",
        editable=False,
        blank=False,
        null=False
    )

    description = models.TextField(
        verbose_name="Description",
        help_text="Description of the complaint",
        blank=False,
        null=False
    )

    category = models.ForeignKey(
        "Category",
        on_delete=models.CASCADE,
        related_name="category",
        help_text="Category of the complaint",
        verbose_name="Category",
        blank=False,
        null=False
    )

    type = models.CharField(
        max_length=255,
        verbose_name="Type",
        choices=ComplaintTypeChoices.choices,
        default=ComplaintTypeChoices.PRIVATE,
        help_text="The type of the complaint",
        blank=False,
        null=False
    )

    is_anonymous = models.BooleanField(
        default=False,
        verbose_name="Is Anonymous",
        help_text="Whether the complaint is anonymous or not"
    )

    status = models.CharField(
        max_length=255,
        verbose_name="Status",
        choices=StatusChoices.choices,
        default=StatusChoices.OPEN,
        help_text="The status of the complaint",
        blank=False,
        null=False
    )

    deadline = models.DateTimeField(
        verbose_name="Deadline",
        blank=True,
        null=True
    )

    semester = models.CharField(
        max_length=255,
        choices=SemesterChoices.choices,
        default=SemesterChoices.FALL,
        verbose_name="Semester",
        help_text="Semester during which the complaint was submitted",
        blank=False,
        null=False
    )

    year = models.PositiveIntegerField(
        verbose_name="Year",
        default=get_current_year,
        help_text="The semester year that the complaint was submitted",
        blank=False,
        null=False
    )

    course = models.ForeignKey(
        'Course',
        on_delete=models.CASCADE,
        related_name='courses',
        verbose_name='Course',
        help_text="The course for which a complaint was submitted",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Created At",
        help_text="Date and time when the complaint was created"
    )

    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Updated At",
        help_text="Date and time when the complaint was updated"
    )

    def save(self, *args, **kwargs):
        if not self.title:
            timestamp = timezone.now().strftime("%Y%m%d%H%M%S")
            self.title = f"{self.category.name} - {self.student.username} - {timestamp}"
        self.slug = slugify(self.title)
        if not self.pk:
            self.deadline = timezone.now() + timedelta(days=3)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class ComplaintAssignment(models.Model):
    """
        Model representing a Complaint Assignment
    """

    class Meta:
        verbose_name = "Complaint Assignment"
        verbose_name_plural = "Complaint Assignments"

    complaint = models.ForeignKey(
        Complaint,
        on_delete=models.CASCADE,
        related_name="assignments",
        verbose_name="Complaint",
        help_text="The complaint being assigned",
    )

    staff = models.ForeignKey(
        get_user_model(),
        on_delete=models.CASCADE,
        related_name="assigned_complaints",
        limit_choices_to={'role__in': ['Lecturer', 'Admin', 'Complaint Coordinator']},
        verbose_name="Staff",
        help_text="The staff member assigned to the complaint",
    )

    assigned_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Assigned At",
        help_text="The date and time when the complaint was assigned",
    )

    reminder_count = models.PositiveIntegerField(
        default=0,
        verbose_name="Reminder Count",
        help_text="The number of reminders sent to the staff member",
    )

    message = models.TextField(
        verbose_name="Message",
        help_text="Message sent along with the assignment",
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Created At",
        help_text="Date and time when the assignment was created"
    )

    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Updated At",
        help_text="Date and time when the assignment was updated"
    )

    def save(self, *args, **kwargs):
        if not self.message:
            self.message = f"You have been assigned to provide a resolution to '{self.complaint.title}' before {self.complaint.deadline}."
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.complaint.title} assigned to {self.staff.username}"


class Category(models.Model):
    """
        Model representing a Category
    """

    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"

    name = models.CharField(
        max_length=250,
        verbose_name="Name",
        unique=True,
        blank=False,
        null=False
    )

    description = models.TextField(
        verbose_name="Description",
        blank=False,
        null=False
    )

    admins = models.ManyToManyField(
        'AdminProfile',
        related_name='categories',
        verbose_name="Admins",
        help_text="Admins responsible for this category",
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Created At",
        help_text="Date and time when the category was created"
    )

    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Updated At",
        help_text="Date and time when the category was updated"
    )

    def __str__(self):
        return self.name


class Attachment(models.Model):
    """
        Model representing an Attachment
    """
    complaint = models.ForeignKey(
        'Complaint',
        on_delete=models.CASCADE,
        related_name='attachments',
        verbose_name='Complaint',
        help_text='The complaint this attachment belongs to'
    )

    file_url = models.FileField(
        upload_to='attachments/%Y/%m/%d/', verbose_name='File URL',
        help_text='URL of the file', blank=True, null=True
    )

    file_type = models.CharField(
        max_length=255,
        verbose_name='File Type',
        help_text='Type of the file', blank=True, null=True
    )

    uploaded_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Uploaded At',
        help_text='Date and time when the file was uploaded'
    )

    def save(self, *args, **kwargs):
        if self.file_url and not self.file_type:
            mime_type, _ = mimetypes.guess_type(self.file_url.name)
            self.file_type = mime_type or 'unknown'
        super().save(*args, **kwargs)

    def __str__(self):
        return self.file_url.name


class Endorsement(models.Model):
    """
        Model representation of an Endorsement
    """

    student = models.ForeignKey(
        get_user_model(),
        on_delete=models.CASCADE,
        related_name="endorsements",
        limit_choices_to={'role': 'Student'},
        verbose_name="Student",
        help_text="The student submitting the complaint",
    )

    complaint = models.ForeignKey(
        Complaint,
        on_delete=models.CASCADE,
        related_name="endorsements",
        verbose_name="Complaint",
        help_text="The complaint being assigned",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Created At',
        help_text='Date and time when the complaint was created',
    )

    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='Updated At',
        help_text='Date and time when the complaint was updated',
    )

    def __str__(self):
        return f"Endorsement by {self.student.username} for {self.complaint.title}"


class Resolution(models.Model):
    """
        Model representing a Resolution
    """

    complaint = models.ForeignKey(
        Complaint,
        on_delete=models.CASCADE,
        related_name="resolutions",
        verbose_name="Complaint",
        help_text="The complaint being assigned",
    )

    resolved_by = models.ForeignKey(
        AdminProfile,
        on_delete=models.CASCADE,
        related_name="resolved_resolutions",
        verbose_name="Resolved by",
        help_text="The admin who resolved the complaint",
    )

    reviewed_by = models.ForeignKey(
        AdminProfile,
        on_delete=models.CASCADE,
        related_name="reviewed_resolutions",
        verbose_name="Reviewed by",
        help_text="The admin who reviewed the resolution",
        null=True,
        blank=True,
    )

    is_reviewed = models.BooleanField(
        default=False,
        verbose_name="Is Reviewed",
        help_text="Whether the resolution has been reviewed",
    )

    comments = models.TextField(
        verbose_name='Response',
        help_text='response to complaint',
        blank=False,
        null=False,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Created At',
        help_text='Date and time when the resolution was created'
    )

    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='Updated At',
        help_text='Date and time when the resolution was updated'
    )

    attendance_mark = models.PositiveIntegerField(
        verbose_name='Attendance Mark',
        null=True,
        blank=True
    )

    assignment_mark = models.PositiveIntegerField(
        verbose_name='Assignment Mark',
        null=True,
        blank=True
    )

    ca_mark = models.PositiveIntegerField(
        verbose_name='CA Mark',
        null=True,
        blank=True
    )

    final_mark = models.PositiveIntegerField(
        verbose_name='Final Mark',
        null=True,
        blank=True
    )

    def save(self, *args, **kwargs):
        # Ensure `reviewed_by` is either a Complaint Coordinator or Registrar Office admin
        if self.is_reviewed and self.reviewed_by:
            if (
                    self.reviewed_by.user.role != UserRole.COMPLAINT_COORDINATOR
                    and self.reviewed_by.office != OfficeChoices.REGISTRAR_OFFICE
            ):
                raise ValidationError(
                    "Only Complaint Coordinators or Admins from the Registrar Office can review resolutions."
                )
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Resolution for {self.complaint.title} by {self.resolved_by.user.username}"


class Notification(models.Model):
    recipient = models.ForeignKey(
        get_user_model(),
        on_delete=models.CASCADE,
        related_name="notifications",
        verbose_name="Recipient",
        help_text="The recipient of the notification",
    )

    message = models.TextField(
        verbose_name="Message",
        blank=False, null=False
    )

    is_read = models.BooleanField(
        default=False,
        verbose_name="Is Read",
        help_text="Whether the notification has been read or not"
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Created At',
        help_text='Date and time when the notification was created'
    )

    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='Updated At',
        help_text='Date and time when the notification was updated'
    )

    def __str__(self):
        return f"Notification for {self.recipient.username}: {self.message[:20]}..."


class Reminder(models.Model):
    staff = models.ForeignKey(
        get_user_model(),
        on_delete=models.CASCADE,
        related_name="reminders",
        limit_choices_to={'role__in': ['Lecturer', 'Admin', 'Complaint Coordinator']},
        verbose_name="Staff",
        help_text="The staff member to whom the reminder is sent",
    )

    complaint = models.ForeignKey(
        Complaint,
        on_delete=models.CASCADE,
        related_name="reminders",
        verbose_name="Complaint",
        help_text="The complaint for which the reminder is sent",
    )

    sent_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Sent At',
        help_text='Date and time when the reminder was sent'
    )

    def __str__(self):
        return f"Reminder for {self.complaint.title} to {self.staff.username}"
