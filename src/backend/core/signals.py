import os
from django.conf import settings
from allauth.account.signals import user_logged_in
from django.dispatch import receiver
from django.core.exceptions import PermissionDenied
from django.contrib.auth import get_user_model
from core.models import StudentProfile, LecturerProfile, AdminProfile, Course
from core.utils import get_courses_for_lecturer

# Create your signals here.

User = get_user_model()


@receiver(user_logged_in)
def auto_assign_role_and_profile(sender, request, user, **kwargs):
    if not user.email.endswith('@ictuniversity.edu.cm'):
        user.delete()
        raise PermissionDenied("Only ICT University emails are allowed.")

    username = user.email.split('@')[0]
    lecturer_name = user.get_full_name() or username  # Adjust if you store name differently

    # Check for lecturer courses
    lecturer_courses = get_courses_for_lecturer(lecturer_name)
    admin_file = os.path.join(settings.BASE_DIR, 'core', 'data', 'admins.csv')

    def find_in_csv(csv_file, key, value):
        try:
            with open(csv_file, newline='') as f:
                import csv
                reader = csv.DictReader(f)
                for row in reader:
                    if row.get(key) == value:
                        return row
        except FileNotFoundError:
            return None
        return None

    admin_row = find_in_csv(admin_file, 'username', username)

    if lecturer_courses:
        user.role = 'Lecturer'
        user.save()
        lecturer_profile, _ = LecturerProfile.objects.get_or_create(user=user)
        for course_row in lecturer_courses:
            Course.objects.get_or_create(
                code=course_row['code'],
                defaults={
                    'title': course_row['title'],
                    'semester': course_row['semester'],
                    'year': int(course_row.get('year', 2024)),
                    'lecturer': lecturer_profile,
                    'faculty': course_row['faculty'],
                }
            )
    elif admin_row:
        user.role = 'Admin'
        user.save()
        AdminProfile.objects.get_or_create(user=user, defaults=admin_row)
    else:
        user.role = 'Student'
        user.save()
        StudentProfile.objects.get_or_create(user=user)
