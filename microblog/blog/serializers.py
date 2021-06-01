from django.db.models import fields
from blog.models import Like, Post
from rest_framework import serializers


class PostSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source = 'owner.username')
    class Meta:
        model = Post
        fields = ['id', 'body', 'created', 'owner']


class LikeSerializer(serializers.ModelSerializer):
    who_liked = serializers.ReadOnlyField(source = 'who_liked.username')
    post = serializers.ReadOnlyField(source = 'post.body')
    
    class Meta:
        model = Like
        fields = ['id', 'post', 'who_liked']