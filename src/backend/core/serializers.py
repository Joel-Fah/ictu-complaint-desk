from allauth.socialaccount.models import SocialAccount
from django.contrib.auth.models import User
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    google_data = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = '__all__'
        extra_kwargs = {'password': {'write_only': True}}

    def get_google_data(self, obj):
        try:
            social_account = SocialAccount.objects.get(user=obj, provider='google')
            return {
                'provider': social_account.provider,
                'uid': social_account.uid,
                'extra_data': social_account.extra_data,  # Includes Google-specific user data
            }
        except SocialAccount.DoesNotExist:
            return None

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user