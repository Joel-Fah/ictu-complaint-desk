import dj_database_url
from dotenv import load_dotenv

from .base import *

# Load prod.env file
load_dotenv(
    os.path.join(BASE_DIR, 'prod.env')
)

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('SECRET_KEY')

DEBUG = os.getenv("DEBUG", False) == 'True'

ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS').split(" ") if os.getenv('ALLOWED_HOSTS') else []

# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

DATABASES = {
    # Configure a database for your production environment
    'default': dj_database_url.parse(os.getenv('SUPABASE_POSTGRESQL_URL')),
}

SITE_URL = os.getenv('SITE_URL')

CSRF_TRUSTED_ORIGINS = os.getenv('CSRF_TRUSTED_ORIGINS').split(" ")

# Storage settings
# Configure your storage settings for production

# Static and Media files
# Configure your static and media files for production

STORAGES = {
    "staticfiles": {
        "BACKEND": "storages.backends.s3boto3.S3Boto3Storage",
        "OPTIONS": {
            "access_key": os.environ.get("SUPABASE_S3_ACCESS_KEY_ID"),
            "secret_key": os.environ.get("SUPABASE_S3_SECRET_ACCESS_KEY"),
            "bucket_name": os.environ.get("SUPABASE_S3_BUCKET_NAME"),
            "region_name": os.environ.get("SUPABASE_S3_REGION_NAME"),
            "endpoint_url": os.environ.get("SUPABASE_S3_ENDPOINT_URL"),
            "location": "static",
        },
    },
    "default": {
        "BACKEND": "storages.backends.s3.S3Storage",
        "OPTIONS": {
            "access_key": os.environ.get("SUPABASE_S3_ACCESS_KEY_ID"),
            "secret_key": os.environ.get("SUPABASE_S3_SECRET_ACCESS_KEY"),
            "bucket_name": os.environ.get("SUPABASE_S3_BUCKET_NAME"),
            "region_name": os.environ.get("SUPABASE_S3_REGION_NAME"),
            "endpoint_url": os.environ.get("SUPABASE_S3_ENDPOINT_URL"),
        },
    },
}

STATIC_URL = '/static/'
MEDIA_URL = '/media/'

# Frontend
FRONTEND_URL = os.getenv('FRONTEND_URL_PROD', 'https://ictu-complaint-desk.vercel.app')