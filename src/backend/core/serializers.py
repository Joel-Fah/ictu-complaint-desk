from allauth.socialaccount.models import SocialAccount
from django.contrib.auth.views import get_user_model
from rest_framework import serializers

from core.models import Category, Complaint, StudentProfile, LecturerProfile, AdminProfile

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


class ProfileCompleteSerializer(serializers.Serializer):
    role = serializers.ChoiceField(choices=['Student', 'Lecturer', 'Admin'])
    student_number = serializers.CharField(required=False, allow_blank=True)
    department = serializers.CharField(required=False, allow_blank=True)

    def validate(self, data):
        role = data.get('role')
        if role == 'Student' and not data.get('student_number'):
            raise serializers.ValidationError({'student_number': 'This field is required for students.'})
        if role in ['Lecturer', 'Admin'] and not data.get('department'):
            raise serializers.ValidationError({'department': 'This field is required for staff.'})
        return data


# Category Serializer
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


# Complaint Serializer
class ComplaintSerializer(serializers.ModelSerializer):
    class Meta:
        model = Complaint
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']
