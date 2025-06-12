from django.contrib import admin
from django.contrib.admin.widgets import AdminFileWidget
from django.contrib.auth import get_user_model

from django.contrib.auth.admin import UserAdmin
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _

from core.models import Category, Complaint, ComplaintAssignment, \
    StudentProfile, LecturerProfile, AdminProfile, Course, Resolution, Reminder, Notification, Attachment

# Utilities
User = get_user_model()


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ['username', 'email', 'role', 'secondary_role', 'is_staff', 'is_active']
    search_fields = ['username', 'email']
    list_filter = ['role', 'is_staff', 'is_active']

    fieldsets = (
        (None, {
            'fields': ('username', 'email', 'password')
        }),
        (_('Personal info'), {
            'fields': ('first_name', 'last_name', 'role', 'secondary_role')
        }),
        (_('Permissions'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')
        }),
        (_('Important dates'), {
            'fields': ('last_login', 'date_joined')
        }),
    )


@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'student_number']
    search_fields = ['user__username', 'user__email', 'student_number']

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user')


@admin.register(LecturerProfile)
class LecturerProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'courses__faculty']
    search_fields = ['user__username', 'user__email']
    list_filter = ['courses__faculty']

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user')


@admin.register(AdminProfile)
class AdminProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'office', 'function']
    search_fields = ['user__username', 'user__email', 'office', 'function']

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user')


class CustomAdminFileWidget(AdminFileWidget):
    def render(self, name, value, attrs=None, renderer=None):
        result = []
        try:
            if hasattr(value, "url"):
                result.append(
                    f'''<a href="{value.url}" target="_blank">
                          <img 
                            src="{value.url}" alt="{value}" 
                            width="100" height="100"
                            style="object-fit: cover; border-radius: 8px;"
                          />
                        </a>'''
                )
            result.append(super().render(name, value, attrs, renderer))
        except ValueError:
            result.append(super().render(name, value, attrs, renderer))
        return format_html("".join(result))


# Register your models here.
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'get_admins']
    search_fields = ['name']

    def get_admins(self, obj):
        return ", ".join([admin.user.username for admin in obj.admins.all()])

    get_admins.short_description = "Admins"


@admin.register(Complaint)
class ComplaintAdmin(admin.ModelAdmin):
    list_display = ['id', 'student__username', 'title', 'status', 'semester_year']
    list_filter = ['category', 'status', 'type', 'is_anonymous']
    search_fields = ['title', 'description']
    readonly_fields = ['deadline', 'created_at']

    def semester_year(self, obj):
        return f'{obj.semester} {obj.year}'


@admin.register(Attachment)
class AttachmentAdmin(admin.ModelAdmin):
    list_display = ['id', 'complaint', 'file_url', 'file_type']
    search_fields = ['file_url', 'complaint__title']
    list_filter = ['file_type', 'uploaded_at']
    readonly_fields = ['file_type']


@admin.register(ComplaintAssignment)
class ComplaintAssignmentAdmin(admin.ModelAdmin):
    list_display = ['id', 'complaint', 'staff__username', 'reminder_count']
    list_filter = ['staff', 'created_at']
    search_fields = ['complaint__title']
    readonly_fields = ['created_at']


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['code', 'title', 'semester_year', 'lecturer', 'faculty']
    search_fields = ['code', 'title']
    list_filter = ['semester', 'year', 'faculty']

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('lecturer')

    def semester_year(self, obj):
        return f'{obj.semester} {obj.year}'


@admin.register(Resolution)
class ResolutionAdmin(admin.ModelAdmin):
    list_display = ['complaint', 'resolved_by', 'is_reviewed']
    list_filter = ['resolved_by', 'created_at', 'resolved_by']
    search_fields = ['comments', 'complaint__title']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Reminder)
class ReminderAdmin(admin.ModelAdmin):
    list_display = ['staff', 'sent_at']
    list_filter = ['sent_at']
    search_fields = ['complaint__title']
    readonly_fields = ['sent_at']


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['recipient', 'message', 'created_at', 'is_read']
    list_filter = ['is_read', 'created_at']
    search_fields = ['message', 'recipient__username']
    readonly_fields = ['created_at']
