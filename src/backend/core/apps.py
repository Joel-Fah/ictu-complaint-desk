from django.apps import AppConfig

class CoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'core'

    def ready(self):
        import core.signals
        from django.db import connection
        from core.models import Category

        def table_exists(table_name):
            with connection.cursor() as cursor:
                return table_name in connection.introspection.table_names()

        defaults = [
            ('Missing Grade', 'Missing grade for a course.'),
            ('No CA Mark', 'No continuous assessment mark.'),
            ('No Exam Mark', 'No exam mark recorded.'),
            ('Unsatisfied With Final Grade', 'Final grade is unsatisfactory.'),
        ]
        if table_exists(Category._meta.db_table):
            for name, desc in defaults:
                Category.objects.get_or_create(name=name, defaults={'description': desc})