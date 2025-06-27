import logging

from allauth.socialaccount.models import SocialAccount
from django.contrib.auth.views import get_user_model
from rest_framework import serializers, status
from rest_framework.response import Response

from core.models import Category, Complaint, Reminder, Notification, Resolution, StudentProfile, LecturerProfile, \
    AdminProfile, Attachment, Course, UserRole, OfficeChoices, ComplaintAssignment

# Create your serializers here.

User = get_user_model()
logger = logging.getLogger(__name__)


class StudentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentProfile
        fields = '__all__'


class LecturerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = LecturerProfile
        fields = '__all__'


class AdminProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminProfile
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    google_data = serializers.SerializerMethodField()
    profiles = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = '__all__'
        extra_kwargs = {'password': {'write_only': True}}

    def get_profiles(self, obj):
        profiles = []
        if hasattr(obj, 'studentprofile'):
            profiles.append({
                'type': 'student',
                'data': StudentProfileSerializer(obj.studentprofile).data
            })
        if hasattr(obj, 'lecturerprofile'):
            profiles.append({
                'type': 'lecturer',
                'data': LecturerProfileSerializer(obj.lecturerprofile).data
            })
        if hasattr(obj, 'adminprofile'):
            profiles.append({
                'type': 'admin',
                'data': AdminProfileSerializer(obj.adminprofile).data
            })
        return profiles

    def get_google_data(self, obj):
        try:
            social_account = SocialAccount.objects.get(user=obj, provider='google')
            return {
                'provider': social_account.provider,
                'uid': social_account.uid,
                'extra_data': social_account.extra_data,
            }
        except SocialAccount.DoesNotExist:
            return None

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class AttachmentSerializer(serializers.ModelSerializer):
    complaint = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Attachment
        fields = ['id', 'file_url', 'file_type', 'uploaded_at', 'complaint']


# Complaint Serializer
class ComplaintSerializer(serializers.ModelSerializer):
    attachments = AttachmentSerializer(many=True, read_only=True)

    class Meta:
        model = Complaint
        fields = '__all__'
        read_only_fields = ['student', 'created_at', 'updated_at']
        extra_kwargs = {
            'category': {'required': False, 'allow_null': True},
            'semester': {'required': False, 'allow_null': True},
            'course': {'required': False, 'allow_null': True},
            'description': {'required': False, 'allow_blank': True, 'allow_null': True},
            'deadline': {'required': False, 'allow_null': True},
            'status': {'required': False},
        }

    title = serializers.CharField(required=False, allow_blank=True)


class ComplaintAssignmentSerializer(serializers.ModelSerializer):
    complaint = serializers.PrimaryKeyRelatedField(
        queryset=Complaint.objects.all(), write_only=True
    )

    class Meta:
        model = ComplaintAssignment
        fields = '__all__'

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['complaint'] = ComplaintSerializer(instance.complaint).data
        return rep


class ReminderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reminder
        fields = '__all__'
        read_only_fields = ['sent_at']


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'
        read_only_fields = ['recipient', 'created_at', 'updated_at']


class ResolutionSerializer(serializers.ModelSerializer):
    resolved_by = serializers.PrimaryKeyRelatedField(read_only=True)
    reviewed_by = serializers.PrimaryKeyRelatedField(queryset=AdminProfile.objects.all(), required=False, allow_null=True)

    class Meta:
        model = Resolution
        fields = '__all__'

    # def validate(self, data):
    #     if data.get('is_reviewed') and data.get('reviewed_by'):
    #         admin_profile = data['reviewed_by']
    #         if (
    #             admin_profile.user.role != UserRole.COMPLAINT_COORDINATOR
    #             and admin_profile.office != OfficeChoices.REGISTRAR_OFFICE
    #         ):
    #             raise serializers.ValidationError(
    #                 "Only Complaint Coordinators or Admins from the Registrar Office can review resolutions."
    #             )
    #     return data

# Courses Serializer
class CourseSerializer(serializers.ModelSerializer):
    lecturer = LecturerProfileSerializer(read_only=True)

    class Meta:
        model = Course
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
