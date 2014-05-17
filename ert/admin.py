from django.contrib import admin

from ert.models import ContactRequest

admin.site.register(ContactRequest)

# Setup django-social-auth to use google for admin login
from django.conf import settings
from django.contrib import admin
from django.contrib.auth.views import redirect_to_login
from django.core.exceptions import PermissionDenied
