import dj_database_url
from dotenv import load_dotenv

from .base import *

# Settings overrides for development environment

# Load dev.env file
load_dotenv(
    os.path.join(BASE_DIR, 'dev.env')
)

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.getenv('DEBUG', False) == 'True'

ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS').split(" ") if os.getenv('ALLOWED_HOSTS') else ['*']

# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    },
'supabase': dj_database_url.parse(os.getenv('SUPABASE_POSTGRESQL_URL')),
}

SITE_URL = 'http://127.0.0.1:8000/'

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.2/howto/static-files/

STATIC_URL = 'theme/static/'
MEDIA_URL = '/media/'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
