from rest_framework.fields import ReadOnlyField
from blog.models import Follow, Like, Post, Profile
from rest_framework import serializers
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404


class UserSerializer(serializers.ModelSerializer):

    following = serializers.SerializerMethodField('is_following')

    def is_following(self, user):
        request = self.context.get('request', None)
        if request:
            try:
                follower_user = Profile.objects.get(user=request.user)
                following_user = Profile.objects.get(user=user)
                follow = get_object_or_404(Follow, follower=follower_user, following=following_user)
                return True
            except:
                return False
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'first_name', 'last_name', 'email', 'following']
        extra_kwargs = {'password': {'write_only': True}}
    
    
    def create(self, validated_data):
        # request = self.context.get('request', None)
        # print(request.FILES['file'])
        user = User(username=validated_data['username'], first_name=validated_data['first_name'], last_name=validated_data['last_name'], email=validated_data['email'])
        user.set_password(validated_data['password'])
        user.save()
        profile = Profile.objects.create(user = user)
        profile.save()

        return user

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(serializers.ReadOnlyField(source='user.username'))

    class Meta:
        fields = ['id', 'created', 'user', 'icon']
        model = Profile

        
class PostSerializer(serializers.ModelSerializer):
    owner = ProfileSerializer(serializers.ReadOnlyField(source = 'owner.user'))
    # like_count = serializers._ER
    test = 1
    class Meta:
        model = Post
        fields = ['id', 'body', 'created', 'owner']
        depth = 1
        

class LikeSerializer(serializers.ModelSerializer):
    who_liked = UserSerializer()
    class Meta:
        model = Like
        fields = ['id', 'created', 'post', 'who_liked', 'test']
        depth = 1

class FollowSerializer(serializers.ModelSerializer):
    follower = serializers.ReadOnlyField(source = 'follower.username')

    class Meta:
        model = Follow
        fields = ['id', 'follower', 'following']
