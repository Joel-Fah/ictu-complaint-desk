from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.contrib import admin
from .views import HomeView, UserCreate, google_login_callback, UserDetailView, validate_google_token, google_logout, \
    CategoryListCreateView, CategoryDetailView, UserListCreateView, UserDetailView, ReminderViewSet, \
    NotificationViewSet, ResolutionListCreateView, ResolutionRetrieveUpdateDestroyView

# Create your urls here

app_name = 'core'
router = DefaultRouter()
router.register(r'reminders', ReminderViewSet, basename='reminder')
router.register(r'notifications', NotificationViewSet, basename='notification')



urlpatterns = [
    path('', HomeView.as_view(), name='home'),
    path('user/reister/', UserCreate.as_view(), name='user_create'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('callback/', google_login_callback, name='callback'),
    path('google/validate_token/', validate_google_token, name='validate_token'),
    path('auth/user/', UserDetailView.as_view(), name='user_details'),
    path('auth/logout/', google_logout, name='google_logout'),

    #categories
    path('categories/', CategoryListCreateView.as_view(), name='category_list_create'),
    path('categories/<int:pk>/', CategoryDetailView.as_view(), name='category_detail'),

    #Users
    path('api/users/', UserListCreateView.as_view(), name='user-list-create'),
    path('api/users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),

    #Reminders
    path('admin/', admin.site.urls),
    #notifications
    path('', include(router.urls)),
    #Resolution
    path('api/resolutions/', ResolutionListCreateView.as_view(), name='resolution-list-create'),
    path('api/resolutions/<int:pk>/', ResolutionRetrieveUpdateDestroyView.as_view(), name='resolution-detail'),
]
urlpatterns += router.urls