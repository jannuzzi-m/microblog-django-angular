from django.contrib.auth.models import User
from django.db.models import query
from rest_framework.response import Response
from blog import serializers
from blog.models import Follow, Post
from blog.serializers import FollowSerializer, PostSerializer, UserSerialize
from rest_framework import generics, request
from rest_framework.permissions import IsAuthenticated
from blog.permissions import IsOwner


class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerialize


class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerialize


class TimeLine(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]


    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(owner=user)

    
    def get_queryset(self):
       followed_users = [user.following for user in Follow.objects.all() if user.follower == self.request.user]
       followed_users.append(self.request.user)
       queryset = [post for post in Post.objects.all() if post.owner in followed_users]
       return queryset


class PostDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    permission_classes = [IsOwner, IsAuthenticated]
    serializer_class = PostSerializer


class LikesCreate(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = Post


    def create(self, request, *args, **kwargs):
        data = request.data
        user = self.request.user
        post = Post.objects.get(id=data['post'])
        post.likes.add(user)
        return Response({"Status": "Created"})
 


class FollowList(generics.ListCreateAPIView):
    queryset = Follow.objects.all()
    serializer_class = FollowSerializer


    def create(self, request, *args, **kwargs):
        user = self.request.user
        following = User.objects.get(id=request.data['user'])
        follow = Follow.objects.create(follower = user, following=following)
        follow.save()
        return Response({"status": "Following"})

