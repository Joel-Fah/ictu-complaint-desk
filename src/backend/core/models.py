from django.db import models
from django.db.models import TextField
from django_filters.utils import verbose_field_name


# Create your models here.
class Complaint(models.Model):
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

    title = models.CharField(max_length=255, verbose_name="Title", blank=False, null=False)
    slug = models.SlugField(max_length=255, unique=True, verbose_name="Category Slug", blank=False, null=False)
    description = models.TextField(verbose_name="Description", blank=False, null=False)
    category = models.ForeignKey("Category", on_delete=models.CASCADE, related_name="category")
    type = models.CharField(max_length=255, verbose_name="Type", choices=ComplaintTypeChoices.choices,
                            default=ComplaintTypeChoices.PRIVATE, blank=False, null=False)
    isAnonymous = models.BooleanField(default=False)
    status = models.CharField(max_length=255, verbose_name="Status", choices=StatusChoices.choices,
                              default=StatusChoices.OPEN)
    deadline = models.DateTimeField(verbose_name="Deadline", blank=False, null=False)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Created At",
                                      help_text="Date and time when the complaint was created")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Updated At",
                                      help_text="Date and time when the complaint was updated")


class Category(models.Model):
    name = models.CharField(max_length=250, verbose_name="Name", blank=False, null=False)
    description = models.TextField(verbose_name="Description", blank=False, null=False)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Created At",
                                      help_text="Date and time when the category was created")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Updated At",
                                      help_text="Date and time when the category was updated")
