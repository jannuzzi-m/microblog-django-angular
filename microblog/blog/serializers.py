from blog.models import Follow, Like, Post
from rest_framework import serializers
from django.contrib.auth.models import User


class UserSerialize(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'first_name', 'last_name', 'email', 'following']
        extra_kwargs = {'password': {'write_only': True}}
    
    
    def create(self, validated_data):
        user = User(username=validated_data['username'], first_name=validated_data['first_name'], last_name=validated_data['last_name'], email=validated_data['email'])
        user.set_password(validated_data['password'])
        user.save()
        return user


class PostSerializer(serializers.ModelSerializer):
    owner = UserSerialize(serializers.ReadOnlyField(source = 'owner.username'))
    # like_count = serializers._ER
    test = 1
    class Meta:
        model = Post
        fields = ['id', 'body', 'created', 'owner']
        depth = 1
        

class LikeSerializer(serializers.ModelSerializer):
    who_liked = UserSerialize()
    class Meta:
        model = Like
        fields = ['id', 'created', 'post', 'who_liked', 'test']
        depth = 1

class FollowSerializer(serializers.ModelSerializer):
    follower = serializers.ReadOnlyField(source = 'follower.username')

    class Meta:
        model = Follow
        fields = ['id', 'follower', 'following']
