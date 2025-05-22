from datetime import timedelta

from django.contrib.auth.models import AbstractUser
from django.db import models
from enum import Enum
from django.contrib.auth import get_user_model


# Create your models here.
class UserRole(Enum):
    STUDENT = 'Student'
    LECTURER = 'Lecturer'
    ADMIN_ASSISTANT = "Admin Assistant"
    COMPLAINT_COORDINATOR = 'Complaint Coordinator'

    @classmethod
    def choices(cls):
        return [(tag, tag.value) for tag in cls]


class CustomUser(AbstractUser):
    role = models.CharField(
        max_length=100,
        choices=UserRole.choices(),
        default=UserRole.STUDENT,
    )


class UserProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='profile')

    # Specific to students
    student_number = models.CharField(max_length=10, unique=True, blank=True, null=True)

    # Specific to lecturers or staff
    department = models.CharField(max_length=10, blank=True, null=True)

    def __str__(self):
        return f"Profile of {self.user.username}"

    def is_student(self):
        return self.user.role == UserRole.STUDENT

    def is_lecturer(self):
        return self.user.role == UserRole.LECTURER

    def is_admin_assistant(self):
        return self.user.role == UserRole.ADMIN_ASSISTANT


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
        CLOSED = "Closed", "Closed"
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
        unique=True,
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

    isAnonymous = models.BooleanField(
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
        blank=False,
        null=False
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
        if not self.pk:  # Check if the object is being created (not updated)
            self.deadline = self.created_at + timedelta(days=3)
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
        limit_choices_to={'role__in': ['Lecturer', 'Admin Assistant', 'Complaint Coordinator']},
        verbose_name="Staff",
        help_text="The staff member assigned to the complaint",
    )

    assignedAt = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Assigned At",
        help_text="The date and time when the complaint was assigned",
    )

    reminderCount = models.PositiveIntegerField(
        default=0,
        verbose_name="Reminder Count",
        help_text="The number of reminders sent to the staff member",
    )

    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Updated At",
        help_text="Date and time when the assignment was updated"
    )

    def __str__(self):
        return f"{self.complaint.title} assigned to {self.staff.username}"


class Category(models.Model):
    name = models.CharField(
        max_length=250,
        verbose_name="Name",
        blank=False,
        null=False
    )

    description = models.TextField(
        verbose_name="Description",
        blank=False,
        null=False
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


class Tag(models.Model):
    """
        Model representing a Tag
    """

    class Meta:
        verbose_name = 'Tag'
        verbose_name_plural = 'Tags'

    name = models.CharField(
        max_length=255,
        verbose_name='Name',
        help_text='Name of the tag',
        blank=False,
        null=False,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Created At',
        help_text='Date and time when the tag was created'
    )

    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='Updated At',
        help_text='Date and time when the tag was last updated'
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
