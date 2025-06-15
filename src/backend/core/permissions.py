# core/permissions.py
from rest_framework.permissions import BasePermission

class IsFacultyAdmin(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        # Must be authenticated, have adminprofile, and office is Faculty
        return (
            user.is_authenticated and
            hasattr(user, 'adminprofile') and
            user.adminprofile.office == 'Faculty'
        )