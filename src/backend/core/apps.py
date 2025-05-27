from django.apps import AppConfig


class CoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'core'

    def ready(self):
        import core.signals

        # Ensure the 4 default categories always exist.
        from core.models import Category
        defaults = [
            ('Missing Grade', 'Missing grade for a course.'),
            ('No CA Mark', 'No continuous assessment mark.'),
            ('No Exam Mark', 'No exam mark recorded.'),
            ('Unsatisfied With Final Grade', 'Final grade is unsatisfactory.'),
        ]
        for name, desc in defaults:
            Category.objects.get_or_create(name=name, defaults={'description': desc})