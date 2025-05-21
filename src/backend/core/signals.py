from allauth.account.signals import user_logged_in
from django.dispatch import receiver
from django.core.exceptions import PermissionDenied

@receiver(user_logged_in)
def restrict_to_ict_emails(sender, request, user, **kwargs):
    if not user.email.endswith('@ictuniversity.edu.cm'):
        user.delete()
        raise PermissionDenied("Only ICT University emails are allowed.")
