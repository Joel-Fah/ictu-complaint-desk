from datetime import timedelta

from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.core.exceptions import ValidationError
from django.db import models
from enum import Enum
from django.contrib.auth import get_user_model
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
        return [(tag, tag.value) for tag in cls]


class OfficeChoices(str, Enum):
    FINANCE_DEPARTMENT = "Finance Department"
    CISCO_LAB = "Cisco Lab"
    REGISTRAR_OFFICE = "Registrar Office"
    FACULTY = "Faculty"

    @classmethod
    def choices(cls):
        return [(choice.name, choice.value) for choice in cls]


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
        unique=True,
        blank=False,
        null=False
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
    class FacultyChoices(models.TextChoices):
        ICT = 'ICT', 'ICT'
        BMS = 'BMS', 'BMS'

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

    staff = models.ForeignKey(
        get_user_model(),
        on_delete=models.CASCADE,
        related_name="resolutions",
        limit_choices_to={'role__in': ['Lecturer', 'Admin', 'Complaint Coordinator']},
        verbose_name="Staff",
        help_text="The staff member who resolved the complaint",
    )

    response = models.CharField(
        max_length=255,
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

    def __str__(self):
        return f"Resolution for {self.complaint.title} by {self.staff.username}"


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
