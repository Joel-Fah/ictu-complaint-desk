import os

from allauth.account.signals import user_logged_in
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.exceptions import PermissionDenied
from django.dispatch import receiver
from django.db.models.signals import post_save

from core.models import StudentProfile, LecturerProfile, AdminProfile, Course, UserRole, Complaint, ComplaintAssignment, \
    Category, OfficeChoices, FacultyChoices, Resolution, Notification
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

    # Map display name to value for OfficeChoices
    office_map = {label: value for value, label in OfficeChoices.choices()}

    is_admin = admin_row is not None
    is_lecturer = bool(lecturer_courses)

    if is_admin and is_lecturer:
        office_value = admin_row.get('office', '').strip()
        office = office_map.get(office_value, OfficeChoices.OTHER)
        user.role = UserRole.ADMIN
        user.secondary_role = UserRole.LECTURER
        user.save()
        AdminProfile.objects.get_or_create(
            user=user,
            defaults={
                'office': office,
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
        office_value = admin_row.get('office', '').strip()
        office = office_map.get(office_value, OfficeChoices.OTHER)
        user.role = UserRole.ADMIN
        user.secondary_role = None
        user.save()
        AdminProfile.objects.get_or_create(
            user=user,
            defaults={
                'office': office,
                'function': admin_row.get('function', '')
            }
        )
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
        if instance.category.name == "Unsatisfied With Final Grade":
            # Ensure System admin exists
            system_user, _ = User.objects.get_or_create(
                email="system@ictuniversity.edu.cm",
                defaults={"username": "system", "role": UserRole.ADMIN}
            )
            system_admin, _ = AdminProfile.objects.get_or_create(user=system_user,
                                                                 office=OfficeChoices.REGISTRAR_OFFICE,
                                                                 function="System Admin.", faculty=FacultyChoices.BOTH)
            instance.status = "Resolved"
            instance.save(update_fields=["status"])
            Resolution.objects.create(
                complaint=instance,
                comments="Visit the finance department and request for bank details for remarking your scripts then proceed.",
                resolved_by=system_admin,
                is_reviewed=True,
                reviewed_by=system_admin,
            )
            Notification.objects.create(
                recipient=instance.student,
                message="Your complaint has been resolved. Please visit the finance department for further instructions."
            )

        # Assign complaint to admins based on the category
        admins = instance.category.admins.all()
        for admin in admins:
            if instance.course.faculty == admin.faculty or admin.faculty == FacultyChoices.BOTH:
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
                message=f"You have been assigned to provide a resolution to '{instance.title}' as the lecturer of the course '{instance.course.title}' before {instance.deadline}."
            )


@receiver(post_save, sender=AdminProfile)
def assign_admin_to_categories(sender, instance, created, **kwargs):
    if created:
        # Map office to category names
        office_category_map = {
            'Faculty': ['Missing Grade', 'No CA Mark', 'No Exam Mark', 'Unsatisfied With Final Grade'],
            'Lecturer': ['Missing Grade', 'No Exam Mark'],
            'Finance Department': ['Unsatisfied With Final Grade'],
        }
        # Map internal value to display name
        office_display = dict(OfficeChoices.choices()).get(instance.office, None)
        for category_name in office_category_map.get(office_display, []):
            try:
                category = Category.objects.get(name=category_name)
                category.admins.add(instance)
            except Category.DoesNotExist:
                pass
