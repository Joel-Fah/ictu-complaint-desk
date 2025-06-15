import json

import requests
from collections import defaultdict
from allauth.socialaccount.models import SocialToken, SocialAccount
from django.conf import settings
from django.contrib.auth import get_user_model, logout
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, Http404
from django.shortcuts import redirect
from django.db.models import Count, F, ExpressionWrapper, OuterRef, Subquery, Avg, DurationField
from rest_framework.views import APIView
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import TemplateView
from rest_framework import viewsets, permissions, generics
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.filters import SearchFilter
from rest_framework.generics import CreateAPIView, RetrieveUpdateAPIView, ListCreateAPIView, \
    RetrieveUpdateDestroyAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Category, Reminder, Notification, Resolution, Complaint, Attachment, Course, ComplaintAssignment
from .serializers import CategorySerializer, UserSerializer, ReminderSerializer, NotificationSerializer, \
    ResolutionSerializer, ComplaintSerializer, CourseSerializer, StudentProfileSerializer, ComplaintAssignmentSerializer

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
    social_account = social_accounts.first()

    if not social_account:
        return redirect(f'{settings.FRONTEND_URL}/login/callback/?error=NoSocialAccount')

    token = SocialToken.objects.get(account=social_account, account__provider='google')
    if token:
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        return redirect(f'{settings.FRONTEND_URL}/login/callback/?access_token={access_token}')
    else:
        return redirect(f'{settings.FRONTEND_URL}/login/callback/?error=NoGoogleToken')


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
    queryset = Complaint.objects.all().order_by('-created_at').prefetch_related('attachments')
    serializer_class = ComplaintSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = ComplaintPagination
    filter_backends = [SearchFilter]
    search_fields = ['title', 'description', 'status']

    def get_queryset(self):
        queryset = super().get_queryset()
        user_id = self.request.query_params.get('userId')
        if user_id:
            queryset = queryset.filter(student__id=user_id).prefetch_related('attachments')
        return queryset.prefetch_related('attachments')

    def perform_create(self, serializer):
        files = self.request.FILES.getlist('attachments')
        allowed_file_types = ['image/jpeg', 'image/jpg', 'image/avif', 'image/tiff', 'image/png',
                              'application/pdf']  # Allowed MIME types
        max_file_size = 2 * 1024 * 1024  # 2 MB
        if len(files) > 2:
            raise ValueError("You can upload a maximum of 2 files.")

        for file in files:
            if file.content_type not in allowed_file_types:
                raise ValueError(f"File type {file.content_type} is not allowed.")
            if file.size > max_file_size:
                raise ValueError(f"File {file.name} exceeds the maximum size of 2 MB.")

        complaint = serializer.save(student=self.request.user)
        for file in files:
            Attachment.objects.create(complaint=complaint, file_url=file)


class ComplaintDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Complaint.objects.all().order_by('-created_at').prefetch_related('attachments')
    serializer_class = ComplaintSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Only allow students to see their own complaints
        if hasattr(user, 'studentprofile'):
            return self.queryset.filter(student=user).prefetch_related('attachments')
        return self.queryset.prefetch_related('attachments')


class ComplaintAssignmentListView(ListCreateAPIView):
    queryset = ComplaintAssignment.objects.all().select_related('complaint', 'staff').prefetch_related(
        'complaint__attachments')
    serializer_class = ComplaintAssignmentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [SearchFilter]
    search_fields = ['complaint__title', 'staff__username']

    def get_queryset(self):
        queryset = super().get_queryset()
        user_id = self.request.query_params.get('userId')
        if user_id:
            # Only allow if user is lecturer or admin
            from django.contrib.auth import get_user_model
            User = get_user_model()
            try:
                user = User.objects.get(pk=user_id)
                if hasattr(user, 'lecturerprofile') or hasattr(user, 'adminprofile'):
                    queryset = queryset.filter(staff__id=user_id)
                else:
                    queryset = queryset.none()
            except User.DoesNotExist:
                queryset = queryset.none()
        return queryset

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsFacultyAdmin()]
        return super().get_permissions()


class UserListCreateView(ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filter_backends = [SearchFilter]
    search_fields = ['username', 'email', 'first_name', 'last_name']
    permission_classes = [IsAuthenticated]


class UserRetrieveView(RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]


class ReminderViewSet(viewsets.ModelViewSet):
    queryset = Reminder.objects.all().order_by('-sent_at')
    serializer_class = ReminderSerializer
    filter_backends = [SearchFilter]
    search_fields = ['complaint__title', 'staff__username']


class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user)

    def perform_create(self, serializer):
        serializer.save(recipient=self.request.user)

    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({'status': 'Notification marked as read'})


class ResolutionListCreateView(ListCreateAPIView):
    queryset = Resolution.objects.all()
    serializer_class = ResolutionSerializer
    filter_backends = [SearchFilter]
    search_fields = ['complaint__title', 'resolved_by__username', 'comments']

    def perform_create(self, serializer):
        complaint = serializer.validated_data['complaint']
        admin_profile = self.request.user.adminprofile

        # Check if the admin is assigned to the complaint
        if not complaint.assignments.filter(staff=self.request.user).exists():
            raise PermissionDenied("You can only resolve complaints assigned to you.")

        serializer.save(resolved_by=admin_profile)


class ResolutionRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    queryset = Resolution.objects.all()
    serializer_class = ResolutionSerializer


# Courses Views
class CourseListCreateView(ListCreateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [SearchFilter]
    search_fields = ['code', 'title', 'lecturer__user__username']

    def perform_create(self, serializer):
        serializer.save(lecturer=self.request.user.lecturerprofile)


class CourseDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'lecturerprofile'):
            return self.queryset.filter(lecturer__user=user)
        return self.queryset


class StudentProfileUpdateView(generics.UpdateAPIView):
    serializer_class = StudentProfileSerializer
    permissions_classes = [IsAuthenticated]

    def get_object(self):
        user = self.request.user
        if hasattr(user, 'studentprofile'):
            return user.studentprofile
        else:
            raise Http404("Student profile does not exist.")


class ComplaintsPerSemesterAnalyticsView(APIView):
    permission_classes = []

    def get(self, request):
        # Assumes Complaint model has 'semester' and 'year' fields
        data = (
            Complaint.objects
            .values('semester', 'year')
            .annotate(count=Count('id'))
            .order_by('year', 'semester')
        )
        labels = [f"{item['semester']} {item['year']}" for item in data]
        counts = [item['count'] for item in data]
        return Response({
            "labels": labels,
            "datasets": [
                {
                    "label": "Complaints",
                    "data": counts
                }
            ]
        })


class ComplaintsPerCategoryPerSemesterAnalyticsView(APIView):
    permission_classes = []

    def get(self, request):
        # Aggregate complaints by category, semester, and year
        data = (
            Complaint.objects
            .values('category__name', 'semester', 'year')
            .annotate(count=Count('id'))
            .order_by('year', 'semester', 'category__name')
        )

        # Collect all unique semesters
        semesters = sorted({f"{item['semester']} {item['year']}" for item in data})
        categories = sorted({item['category__name'] for item in data})

        # Prepare a mapping: category -> [counts per semester]
        counts_by_category = defaultdict(lambda: [0] * len(semesters))
        semester_index = {sem: idx for idx, sem in enumerate(semesters)}

        for item in data:
            sem_label = f"{item['semester']} {item['year']}"
            idx = semester_index[sem_label]
            counts_by_category[item['category__name']][idx] = item['count']

        datasets = [
            {
                "label": category,
                "data": counts_by_category[category]
            }
            for category in categories
        ]

        return Response({
            "labels": semesters,
            "datasets": datasets
        })


class AvgResolutionTimePerSemesterAnalyticsView(APIView):
    permission_classes = []

    def get(self, request):
        # Subquery: earliest resolution time for each complaint
        earliest_resolution = Resolution.objects.filter(
            complaint=OuterRef('pk')
        ).order_by('created_at').values('created_at')[:1]

        # Annotate complaints with their earliest resolution time
        complaints = Complaint.objects.annotate(
            resolved_at=Subquery(earliest_resolution)
        ).exclude(resolved_at__isnull=True)

        # Calculate resolution time as a duration
        complaints = complaints.annotate(
            resolution_time=ExpressionWrapper(
                F('resolved_at') - F('created_at'),
                output_field=DurationField()
            )
        )

        # Group by semester/year and calculate average resolution time (as duration)
        data = (
            complaints
            .values('semester', 'year')
            .annotate(avg_resolution=Avg('resolution_time'))
            .order_by('year', 'semester')
        )

        labels = [f"{item['semester']} {item['year']}" for item in data]
        avg_days = [
            round(item['avg_resolution'].total_seconds() / 86400, 2) if item['avg_resolution'] else 0
            for item in data
        ]

        return Response({
            "labels": labels,
            "datasets": [
                {
                    "label": "Avg Resolution Time (days)",
                    "data": avg_days
                }
            ]
        })
