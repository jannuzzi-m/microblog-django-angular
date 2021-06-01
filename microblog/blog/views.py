from django.contrib.auth.models import User
from django.db.models import query
from django.db.models.fields.related import ForeignKey
from rest_framework.response import Response
from blog.models import Follow, Like, Post
from blog.serializers import FollowSerializer, LikeSerializer, PostSerializer, UserSerialize
from django.shortcuts import render
from rest_framework import generics, request
from rest_framework.permissions import IsAuthenticated
from blog.permissions import IsOwner


class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerialize

class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerialize


class PostList(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]


    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(owner=user)


class PostDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    permission_classes = [IsOwner, IsAuthenticated]
    serializer_class = PostSerializer


class LikesList(generics.ListCreateAPIView):
    queryset = Like.objects.all()
    serializer_class = LikeSerializer


    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(who_liked = user)


    def get_queryset(self):
        #tentar filtrar no banco
        return list(filter(lambda like: like.post.owner == self.request.user, Like.objects.all().order_by('created')))
        

class FollowList(generics.ListCreateAPIView):
    queryset = Follow.objects.all()
    serializer_class = FollowSerializer


    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(follower = user)
    

