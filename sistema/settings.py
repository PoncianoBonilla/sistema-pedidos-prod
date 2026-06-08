import os
from pathlib import Path
from dotenv import load_dotenv
import dj_database_url

# ======================
# BASE
# ======================
BASE_DIR = Path(__file__).resolve().parent.parent

# ======================
# ENV
# ======================
load_dotenv(BASE_DIR / '.env')

# Definir DEBUG primero para reutilizar el booleano limpiamente
DEBUG = os.getenv('DEBUG', 'False') == 'True'

SECRET_KEY = os.getenv('SECRET_KEY')
if not SECRET_KEY and not DEBUG:
    from django.core.exceptions import ImproperlyConfigured
    raise ImproperlyConfigured("La variable de entorno SECRET_KEY debe estar definida en producción.")

# Identificar entorno Render
IS_RENDER = os.getenv('RENDER', 'False') == 'True'

# ======================
# ALLOWED HOSTS & RENDERING CONFIG
# ======================
# Permitir localhost por defecto
ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "127.0.0.1,localhost").split(",")

# Inyectar automáticamente el subdominio que te asigne Render
if os.getenv('RENDER_EXTERNAL_HOSTNAME'):
    ALLOWED_HOSTS.append(os.getenv('RENDER_EXTERNAL_HOSTNAME'))

DATABASE_URL = os.getenv('DATABASE_URL')

# ======================
# APPS
# ======================
INSTALLED_APPS = [
    'cliente',
    'pedido',
    'producto',
    'users',

    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
]

# ======================
# REST FRAMEWORK
# ======================
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}

# ======================
# CORS & CSRF
# ======================
CORS_ALLOWED_ORIGINS = os.getenv(
    "CORS_ALLOWED_ORIGINS",
    "http://localhost:5173,https://sistema-pedidos.vercel.app"
).split(",")

CORS_ALLOW_CREDENTIALS = True

CSRF_TRUSTED_ORIGINS = os.getenv(
    "CSRF_TRUSTED_ORIGINS",
    "http://localhost:5173,https://sistema-pedidos.vercel.app"
).split(",")

# Agregar la URL de Render a los orígenes de confianza para CSRF
if os.getenv('RENDER_EXTERNAL_HOSTNAME'):
    CSRF_TRUSTED_ORIGINS.append(f"https://{os.getenv('RENDER_EXTERNAL_HOSTNAME')}")

# ======================
# MIDDLEWARE
# ======================
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# ======================
# URLS
# ======================
ROOT_URLCONF = 'sistema.urls'

# ======================
# TEMPLATES
# ======================
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'staticfiles'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
}

WSGI_APPLICATION = 'sistema.wsgi.application'

# ======================
# DATABASE
# ======================
if DATABASE_URL:
    # Usar PostgreSQL (Render o local con .env)
    DATABASES = {
        "default": dj_database_url.config(
            default=DATABASE_URL,
            conn_max_age=600,
            conn_health_checks=True,
        )
    }
else:
    # Fallback a SQLite para desarrollo rápido local
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }

# ======================
# PASSWORD VALIDATION
# ======================
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# ======================
# INTERNACIONALIZACIÓN
# ======================
LANGUAGE_CODE = 'es-es'
TIME_ZONE = 'America/La_Paz'
USE_I18N = True
USE_TZ = True

# ======================
# STATIC FILES & WHITENOISE
# ======================
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

# Corrección crítica de sintaxis para los Storages en Django 5.0+
STATICFILES_BACKEND = "django.contrib.staticfiles.storage.StaticFilesStorage" if DEBUG else "whitenoise.storage.CompressedManifestStaticFilesStorage"

STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": STATICFILES_BACKEND,
    },
}

# Optimización de caché para WhiteNoise (1 año en producción, 0 en desarrollo)
WHITENOISE_MAX_AGE = 0 if DEBUG else 31536000

# ======================
# MEDIA FILES (opcional)
# ======================
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# ======================
# LOGGING (Útil para ver errores en los logs de Render)
# ======================
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': os.getenv('DJANGO_LOG_LEVEL', 'INFO'),
            'propagate': False,
        },
        'django.db.backends': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}

# ======================
# DEFAULT AUTO FIELD
# ======================
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ======================
# SEGURIDAD ADICIONAL PARA PRODUCCIÓN
# ======================
if not DEBUG:
    # Indispensable para evitar bucles infinitos de redirección SSL tras el proxy de Render
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SECURE_REFERRER_POLICY = 'same-origin'
    X_FRAME_OPTIONS = 'DENY'

    # HTTP Strict Transport Security (HSTS)
    SECURE_HSTS_SECONDS = 31536000  # 1 año
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True