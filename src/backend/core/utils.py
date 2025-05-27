from datetime import datetime
import csv
import os
from django.conf import settings


def get_current_year():
    return datetime.now().year


def get_courses_for_lecturer(lecturer_name):
    """
    Returns a list of course dicts assigned to the lecturer (by name) from courses.csv.
    """
    courses = []
    courses_file = os.path.join(settings.BASE_DIR, 'core', 'data', 'courses.csv')
    try:
        with open(courses_file, newline='') as f:
            reader = csv.DictReader(f)
            for row in reader:
                # Match by lecturer name (case-insensitive, trimmed)
                if row.get('lecturer', '').strip().lower() == lecturer_name.strip().lower():
                    courses.append(row)
    except FileNotFoundError:
        pass
    return courses
