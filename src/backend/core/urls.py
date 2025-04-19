from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import HomeView, UserCreate, google_login_callback, UserDetailView, validate_google_token

# Create your urls here

app_name = 'core'

urlpatterns = [
    path('', HomeView.as_view(), name='home'),
    path('user/reister/', UserCreate.as_view(), name='user_create'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('callback/', google_login_callback, name='callback'),
    path('google/validate_token/', validate_google_token, name='validate_token'),
    path('auth/user/', UserDetailView.as_view(), name='user_details'),
]
