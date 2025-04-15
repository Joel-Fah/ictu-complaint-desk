from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from django.core.exceptions import PermissionDenied


class ICTEmailOnlyAdapter(DefaultSocialAccountAdapter):
    def pre_social_login(self, request, sociallogin):
        email = sociallogin.account.extra_data.get('email', '')
        if not email.endswith('@ictuniversity.edu.cm'):
            raise PermissionDenied("You must use your ICT University email to log in or sign up.")
