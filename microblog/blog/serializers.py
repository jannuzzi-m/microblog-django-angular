from blog.models import Follow, Like, Post
from rest_framework import serializers
from django.contrib.auth.models import User


class UserSerialize(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']


class PostSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source = 'owner.username')

    class Meta:
        model = Post
        fields = ['id', 'body', 'created', 'owner']



class LikeSerializer(serializers.ModelSerializer):
    who_liked = serializers.ReadOnlyField(source = 'who_liked.username')
    # post = serializers.ReadOnlyField(source = 'post.id')
    
    class Meta:
        model = Like
        fields = ['id', 'post', 'who_liked']

class FollowSerializer(serializers.ModelSerializer):
    follower = serializers.ReadOnlyField(source = 'follower.username')
    # following = serializers.ReadOnlyField(source = 'following.username')

    class Meta:
        model = Follow
        fields = ['id', 'follower', 'following']