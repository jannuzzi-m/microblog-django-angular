from django.contrib.auth.models import User
from django.db.models import query
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from blog import serializers
from blog.models import Follow, Like, Post
from blog.serializers import FollowSerializer, LikeSerializer, PostSerializer, UserSerialize
from rest_framework import generics, request
from rest_framework.permissions import IsAuthenticated
from blog.permissions import IsOwner
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters


class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerialize
        

class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerialize

class BasicInfo(generics.RetrieveAPIView):
    serializer_class = UserSerialize
    
    def get(self, request, *args, **kwargs):
        if(self.request.user):
            return Response(serializers.UserSerialize(self.request.user).data)
   


class TimeLine(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]


    def create(self, request, *args, **kwargs):
        data = request.data
        post = Post.objects.create(
            body=data['body'],
            owner=self.request.user
        )
        post.save()
        return Response(serializers.PostSerializer(post).data)
        
    
    def get_queryset(self):
       followed_users = [user.following for user in Follow.objects.all() if user.follower == self.request.user]
       followed_users.append(self.request.user)
       queryset = [post for post in Post.objects.all().order_by('-created') if post.owner in followed_users]
       return queryset

class PostFromUser(generics.ListAPIView):
    serializer_class = PostSerializer
    def get_queryset(self):
        owner = User.objects.get(pk=self.kwargs['id'])
        return Post.objects.all().filter(owner=owner)


class PostDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    permission_classes = [IsOwner, IsAuthenticated]
    serializer_class = PostSerializer


class LikesCreate(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = LikeSerializer


    def create(self, request, *args, **kwargs):
        data = request.data
        user = self.request.user
        post = Post.objects.get(id=data['post'])
        like = Like.objects.create(post = post, who_liked = user)
        like.save()
        return Response(LikeSerializer(like).data)
 


class FollowList(generics.ListCreateAPIView):
    queryset = Follow.objects.all()
    serializer_class = FollowSerializer
    


    def create(self, request, *args, **kwargs):
        user = self.request.user
        following = User.objects.get(id=request.data['user'])
        follow = Follow.objects.create(follower = user, following=following)
        follow.save()
        return Response({"status": "Following"})

class FollowDetail(generics.RetrieveDestroyAPIView):

    def delete(self, request, id,*args, **kwargs):
        try:
            # print(id)
            currentUser = self.request.user
            unfollowedUser = User.objects.get(pk=id)
            follow = Follow.objects.get(follower=currentUser, following=unfollowedUser)
            follow.delete()
            return Response({"Details": "Deleted"})
        except:
            return Response({"Details": "Not Found"})




class UserSearch(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerialize
    filter_backends = [filters.SearchFilter]
    search_fields = ['^username']