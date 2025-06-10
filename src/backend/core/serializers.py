from allauth.socialaccount.models import SocialAccount
from django.contrib.auth.views import get_user_model
from rest_framework import serializers
from core.models import Category, Complaint, Reminder, Notification, Resolution, StudentProfile, LecturerProfile, \
    AdminProfile,Attachment

# Create your serializers here.

User = get_user_model()


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
    profile = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = '__all__'
        extra_kwargs = {'password': {'write_only': True}}

    def get_profile(self, obj):
        if hasattr(obj, 'studentprofile'):
            return StudentProfileSerializer(obj.studentprofile).data
        elif hasattr(obj, 'lecturerprofile'):
            return LecturerProfileSerializer(obj.lecturerprofile).data
        elif hasattr(obj, 'adminprofile'):
            return AdminProfileSerializer(obj.adminprofile).data
        return None

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
    complaint = serializers.SerializerMethodField()
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
    class Meta:
        model = Resolution
        fields = '__all__'
