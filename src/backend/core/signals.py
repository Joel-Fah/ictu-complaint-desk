import os

from allauth.account.signals import user_logged_in
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.exceptions import PermissionDenied
from django.dispatch import receiver
from django.db.models.signals import post_save

from core.models import StudentProfile, LecturerProfile, AdminProfile, Course, UserRole, Complaint, ComplaintAssignment
from core.utils import match_email_to_csv, get_current_year

# Create your signals here.

User = get_user_model()


@receiver(user_logged_in)
def auto_assign_role_and_profile(sender, request, user, **kwargs):
    if not user.email.endswith('@ictuniversity.edu.cm'):
        user.delete()
        raise PermissionDenied("Only ICT University emails are allowed.")

    admin_file = os.path.join(settings.BASE_DIR, 'core', 'data', 'admins.csv')
    courses_file = os.path.join(settings.BASE_DIR, 'core', 'data', 'courses.csv')

    admin_row = match_email_to_csv(user.email, admin_file)
    lecturer_row = match_email_to_csv(user.email, courses_file)
    lecturer_courses = []
    if lecturer_row:
        from core.utils import get_courses_for_lecturer
        lecturer_courses = get_courses_for_lecturer(lecturer_row['lecturer'])

    is_admin = admin_row is not None
    is_lecturer = bool(lecturer_courses)

    if is_admin and is_lecturer:
        user.role = UserRole.ADMIN
        user.secondary_role = UserRole.LECTURER
        user.save()
        AdminProfile.objects.get_or_create(
            user=user,
            defaults={
                'office': admin_row.get('office', ''),
                'function': admin_row.get('function', '')
            }
        )
        lecturer_profile, _ = LecturerProfile.objects.get_or_create(user=user)
        for course_row in lecturer_courses:
            Course.objects.get_or_create(
                code=course_row['code'],
                defaults={
                    'title': course_row['title'],
                    'semester': course_row['semester'],
                    'year': int(course_row.get('year', get_current_year())),
                    'lecturer': lecturer_profile,
                    'faculty': course_row['faculty'],
                }
            )
    elif is_admin:
        user.role = UserRole.ADMIN
        user.secondary_role = None
        user.save()
        AdminProfile.objects.get_or_create(user=user, defaults=admin_row)
    elif is_lecturer:
        user.role = UserRole.LECTURER
        user.secondary_role = None
        user.save()
        lecturer_profile, _ = LecturerProfile.objects.get_or_create(user=user)
        for course_row in lecturer_courses:
            Course.objects.get_or_create(
                code=course_row['code'],
                defaults={
                    'title': course_row['title'],
                    'semester': course_row['semester'],
                    'year': int(course_row.get('year', get_current_year())),
                    'lecturer': lecturer_profile,
                    'faculty': course_row['faculty'],
                }
            )
    else:
        user.role = UserRole.STUDENT
        user.secondary_role = None
        user.save()
        StudentProfile.objects.get_or_create(user=user)


@receiver(post_save, sender=Complaint)
def create_complaint_assignments(sender, instance, created, **kwargs):
    if created:
        # Assign complaint to admins based on the category
        admins = instance.category.admins.all()
        for admin in admins:
            if instance.course.faculty == AdminProfile.faculty:
                ComplaintAssignment.objects.create(
                    complaint=instance,
                    staff=admin.user,
                    message=f"You have been assigned to provide a resolution to '{instance.title}' before {instance.deadline}."
                )

        # Assign complaint to the lecturer of the selected course
        if instance.course and instance.course.lecturer:
            ComplaintAssignment.objects.create(
                complaint=instance,
                staff=instance.course.lecturer.user,
                message=f"You have been assigned to provide a resolution to '{instance.title}' as the lecturer of the course '{instance.course.title}'."
            )
