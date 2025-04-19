from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect
from django.views.generic import TemplateView
from rest_framework.generics import CreateAPIView, RetrieveUpdateAPIView
from .serializers import UserSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from allauth.socialaccount.models import SocialToken, SocialAccount
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

# Create your views here.

User = get_user_model()


class HomeView(TemplateView):
    template_name = 'core/index.html'


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