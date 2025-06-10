from django.apps import AppConfig

class CoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'core'

    def ready(self):
        import core.signals
        from django.db import connection
        from core.models import Category, AdminProfile
        from django.contrib.auth import get_user_model

        def table_exists(table_name):
            with connection.cursor() as cursor:
                return table_name in connection.introspection.table_names()

        # Predefined categories and their descriptions
        defaults = [
            ('Missing Grade', 'Missing grade for a course.'),
            ('No CA Mark', 'No continuous assessment mark.'),
            ('No Exam Mark', 'No exam mark recorded.'),
            ('Unsatisfied With Final Grade', 'Final grade is unsatisfactory.'),
        ]

        # Mapping categories to admin roles/offices
        category_admin_mapping = {
            'Missing Grade': ['Faculty', 'Lecturer'],
            'No CA Mark': ['Faculty'],
            'No Exam Mark': ['Faculty', 'Lecturer'],
            'Unsatisfied With Final Grade': ['Finance Department', 'Faculty'],
        }

        if table_exists(Category._meta.db_table) and table_exists(AdminProfile._meta.db_table):
            for name, desc in defaults:
                category, _ = Category.objects.get_or_create(name=name, defaults={'description': desc})
                # Assign admins based on the mapping
                for office_or_role in category_admin_mapping.get(name, []):
                    admins = AdminProfile.objects.filter(office=office_or_role)
                    category.admins.add(*admins)