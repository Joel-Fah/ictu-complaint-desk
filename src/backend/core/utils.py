import csv
import os
from datetime import datetime

from django.conf import settings
from rapidfuzz import fuzz


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


def normalize_name(name: str) -> str:
    return name.lower().replace(" ", "").replace(".", "")


def extract_email_name_parts(email: str) -> str | None:
    local_part = email.split("@")[0]  # e.g., johnmichael.doe
    if '.' not in local_part:
        return None  # invalid format
    first_middle, last = local_part.rsplit('.', 1)
    return f"{first_middle} {last}"


def match_email_to_csv(email: str, csv_file: str, threshold=85):
    email_name = normalize_name(extract_email_name_parts(email))
    print(f"Matching for email: {email} (normalized: {email_name}) in {csv_file}")
    if not email_name:
        print("No valid email name extracted.")
        return None

    if os.path.basename(csv_file) == "admins.csv":
        match_column = "name"
    elif os.path.basename(csv_file) == "courses.csv":
        match_column = "lecturer"
    else:
        print("Unknown CSV file.")
        return None

    with open(csv_file, newline='', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            csv_name = normalize_name(row.get(match_column, ""))
            score = fuzz.token_sort_ratio(email_name, csv_name)
            print(f"Comparing to row: {row}")
            print(f"CSV name: {csv_name}, Score: {score}")
            if score >= threshold:
                print("Match found!")
                return row
    print("No match found.")
    return None
