import csv
import os

from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect
from django.views.generic import TemplateView
from rest_framework import status
from rest_framework.filters import SearchFilter
from rest_framework.generics import CreateAPIView, RetrieveUpdateAPIView, ListCreateAPIView, \
    RetrieveUpdateDestroyAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Category, Complaint
from .serializers import UserSerializer, CategorySerializer, ComplaintSerializer, ProfileCompleteSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from allauth.socialaccount.models import SocialToken, SocialAccount
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import requests

# Create your views here.

User = get_user_model()


class HomeView(TemplateView):
    template_name = 'core/index.html'


# Authentication View
class UserCreate(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class UserDetailView(RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


@login_required
def google_login_callback(request):
    user = request.user

    social_accounts = SocialAccount.objects.filter(user=user, provider='google')
    print(f'Social Account for user >>> {social_accounts}')

    social_account = social_accounts.first()
    if not social_account:
        print('No social account found for user')
        # return JsonResponse({'error': 'No social account found for user'}, status=404)
        return redirect('http://localhost:3000/login/callback/?error=NoSocialAccount')

    token = SocialToken.objects.get(account=social_account, account__provider='google')

    if token:
        print(f'Google token found >>> {token}')
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        return redirect(f'http://localhost:3000/login/callback/?access_token={access_token}')
    else:
        print(f'No Google token found for user >>> {user}')
        # return JsonResponse({'error': 'No token found for user'}, status=404)
        return redirect('http://localhost:3000/login/callback/?error=NoGoogleToken')


@csrf_exempt
def validate_google_token(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            google_access_token = data.get('access_token')
            print(f'Google access token >>> {google_access_token}')

            if not google_access_token:
                return JsonResponse({'error': 'Access token is missing'}, status=400)
            return JsonResponse({'valid': True}, status=200)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=405)


def google_logout(request):
    user = request.user

    # Revoke the Google token
    social_tokens = SocialToken.objects.filter(account__user=user, account__provider='google')
    if social_tokens.exists():
        token = social_tokens.first()
        revoke_url = f'https://accounts.google.com/o/oauth2/revoke?token={token.token}'
        response = requests.post(revoke_url)
        if response.status_code == 200:
            print('Google token successfully revoked.')
        else:
            print(f'Failed to revoke Google token: {response.status_code}')

        # Delete the token from the database
        social_tokens.delete()

    # Log the user out of the Django application
    logout(request)

    # Clear the session
    request.session.flush()

    # Send a response to the frontend and redirect to the login page
    return JsonResponse({'message': 'User logged out successfully'}, status=200)


# Categories Views
class CategoryListCreateView(ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = []
    filter_backends = [SearchFilter]
    search_fields = ['name']


class CategoryDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = []


# Complaint Views
class ComplaintPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class ComplaintListCreateView(ListCreateAPIView):
    queryset = Complaint.objects.all()
    serializer_class = ComplaintSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = ComplaintPagination
    filter_backends = [SearchFilter]
    search_fields = ['title', 'description', 'status']

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)


class ComplaintDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Complaint.objects.all()
    serializer_class = ComplaintSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'profile') and user.profile.is_student():
            return self.queryset.filter(student=user)
        return self.queryset
