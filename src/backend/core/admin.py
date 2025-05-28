from django.contrib import admin
from django.contrib.admin.widgets import AdminFileWidget
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _

from core.models import Category, Complaint, ComplaintAssignment, \
    StudentProfile, LecturerProfile, AdminProfile, Course

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
    list_display = ['id', 'name']
    search_fields = ['name']


@admin.register(Complaint)
class ComplaintAdmin(admin.ModelAdmin):
    list_display = ['id', 'student__username', 'title', 'status', 'semester_year']
    list_filter = ['category', 'status', 'type', 'is_anonymous']
    search_fields = ['title', 'description']
    readonly_fields = ['created_at']

    def semester_year(self, obj):
        return f'{obj.semester} {obj.year}'


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