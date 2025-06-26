# Backend Project

This is the backend for a complaint management system built with Django and Django REST Framework. It supports user authentication (including Google OAuth), role-based profiles (Student, Lecturer, Admin), complaint tracking, notifications, and more.

## Features

- User registration and authentication (with Google support)
- Role-based user profiles
- Complaint submission and assignment
- Attachments, reminders, notifications
- Admin and lecturer management
- RESTful API

## Requirements

- Python 3.8+
- pip
- npm (for frontend, if needed)
- PostgreSQL (or your preferred database)

## Environment Variables

Create a `.env` file in the project root with the following variables:

```
DJANGO_SECRET_KEY=your_secret_key
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=postgres://user:password@localhost:5432/dbname
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_HOST_USER=your_email@example.com
EMAIL_HOST_PASSWORD=your_email_password
```

Adjust values as needed for your environment.

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Create and activate a virtual environment:**
   ```
   python -m venv venv
   venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```
   pip install -r requirements.txt
   ```

4. **Apply migrations:**
   ```
   python manage.py migrate
   ```

5. **Create a superuser (optional, for admin access):**
   ```
   python manage.py createsuperuser
   ```

6. **Run the development server:**
   ```
   python manage.py runserver
   ```

The API will be available at `http://localhost:8000/`.

## License

See `LICENSE` file for details.
```
This README provides a brief overview, setup steps, and environment variable guidance.