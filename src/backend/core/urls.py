from django.contrib import admin
from django.urls import path, include
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import ComplaintListCreateView, ComplaintDetailView, StudentProfileUpdateView
from .views import HomeView, UserCreate, google_login_callback, validate_google_token, google_logout, \
    CategoryListCreateView, CategoryDetailView, UserListCreateView, UserDetailView, ReminderViewSet, \
    NotificationViewSet, ResolutionListCreateView, ResolutionRetrieveUpdateDestroyView, CourseListCreateView, \
    CourseDetailView, ComplaintsPerSemesterAnalyticsView, ComplaintsPerCategoryPerSemesterAnalyticsView, \
    AvgResolutionTimePerSemesterAnalyticsView

# Create your urls here.

app_name = 'core'

router = DefaultRouter()
router.register(r'reminders', ReminderViewSet, basename='reminder')
router.register(r'notifications', NotificationViewSet, basename='notification')

schema_view = get_schema_view(
    openapi.Info(
        title="ICTU Complaint Desk API",
        default_version='v1',
        description="Test description",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="joelfah2003@gmail.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    path('swagger<format>/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),

    path('', HomeView.as_view(), name='home'),

    # Token authentication
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Google OAuth2 login
    path('callback/', google_login_callback, name='callback'),
    path('google/validate_token/', validate_google_token, name='validate_token'),

    # User authentication
    path('auth/register/', UserCreate.as_view(), name='user_create'),
    path('auth/login/', UserDetailView.as_view(), name='user_details'),
    path('auth/logout/', google_logout, name='google_logout'),

    # categories
    path('categories/', CategoryListCreateView.as_view(), name='category_list_create'),
    path('categories/<int:pk>/', CategoryDetailView.as_view(), name='category_detail'),

    # complaints
    path('complaints/', ComplaintListCreateView.as_view(), name='complaint_list_create'),
    path('complaints/<int:pk>/', ComplaintDetailView.as_view(), name='complaint_detail'),

    # Users
    path('users/', UserListCreateView.as_view(), name='user-list-create'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),

    # student profile
    path('users/students/profile/', StudentProfileUpdateView.as_view(), name='student-profile-update'),

    # notifications
    path('', include(router.urls)),

    # Resolution
    path('resolutions/', ResolutionListCreateView.as_view(), name='resolution-list-create'),
    path('resolutions/<int:pk>/', ResolutionRetrieveUpdateDestroyView.as_view(), name='resolution-detail'),

    # courses
    path('courses/', CourseListCreateView.as_view(), name='course-list-create'),
    path('courses/<int:pk>/', CourseDetailView.as_view(), name='course-detail'),

    # Analytics
    path('analytics/complaints-per-semester/', ComplaintsPerSemesterAnalyticsView.as_view(),
         name='complaints-per-semester'),
    path(
        'analytics/complaints-per-category-per-semester/',
        ComplaintsPerCategoryPerSemesterAnalyticsView.as_view(),
        name='complaints-per-category-per-semester'
    ),
    path(
        'analytics/avg-resolution-time-per-semester/',
        AvgResolutionTimePerSemesterAnalyticsView.as_view(),
        name='avg-resolution-time-per-semester'
    ),
]
urlpatterns += router.urls
