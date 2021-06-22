from django import http
from django.contrib.auth.models import User
from django.core.files.uploadhandler import FileUploadHandler
from django.db.models import query
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from blog import serializers
from blog.models import Follow, Like, Notification, Post, Profile
from blog.serializers import FollowSerializer, LikeSerializer, NotificationSerializer, PostSerializer, ProfileSerializer, UserSerializer
from rest_framework import generics, request
from rest_framework.permissions import IsAuthenticated
from blog.permissions import IsOwner
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from rest_framework.parsers import JSONParser, MultiPartParser


class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
        

class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class BasicInfo(generics.RetrieveAPIView):
    serializer_class = Profile
    
    def get(self, request, *args, **kwargs):
        profile = Profile.objects.get(user=request.user.id)
        if(self.request.user):
            return Response(serializers.ProfileSerializer(profile).data)

class ProfileList(generics.ListCreateAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer


class ProfileDetails(generics.RetrieveDestroyAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer


class TimeLine(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]


    def create(self, request, *args, **kwargs):
        owner = Profile.objects.get(user=self.request.user)
        data = request.data
        post = Post.objects.create(
            body=data['body'],
            owner=owner
        )
        post.save()
        return Response(serializers.PostSerializer(post).data)
        
    

    def get_queryset(self):
       followed_users = [follow.following for follow in Follow.objects.all() if follow.follower.user == self.request.user]
       followed_users.append(Profile.objects.get(user=self.request.user))
       queryset = [post for post in Post.objects.all().order_by('-created') if post.owner in followed_users]
       return queryset



class PostFromUser(generics.ListAPIView):
    serializer_class = PostSerializer
    def get_queryset(self):
        owner = Profile.objects.get(pk=self.kwargs['id'])
        return Post.objects.all().filter(owner=owner)


class PostDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = PostSerializer


class LikesCreate(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = LikeSerializer


    def create(self, request, *args, **kwargs):
        data = request.data
        user = self.request.user
        profile = Profile.objects.get(user=user)
        post = Post.objects.get(id=data['post'])
        like = Like.objects.create(post = post, who_liked = profile)
        like.save()
        ## create notification
        who_was_notified = Profile.objects.get(user = User.objects.get(username=post.owner))
        notification = Notification.objects.create(who_notified = profile, who_was_notified=who_was_notified, notification_type="like", post=post)
        notification.save()

        return Response(LikeSerializer(like).data)
 


class FollowList(generics.ListCreateAPIView):
    queryset = Follow.objects.all()
    serializer_class = FollowSerializer
    


    def create(self, request, *args, **kwargs):

        data = request.data
        current_user = Profile.objects.get(user = self.request.user)
        followed_user = Profile.objects.get(id = data["user"])
        follow = Follow.objects.create(follower = current_user, following = followed_user)
        follow.save()
        notifcation = Notification.objects.create(who_notified=current_user, who_was_notified=followed_user,notification_type="follow")
        notifcation.save()



        return Response({"status": "Following", "follow": FollowSerializer(follow).data})

class FollowDetail(generics.RetrieveDestroyAPIView):

    def delete(self, request, id, *args, **kwargs):
        try:
            # print(id)
            currentUser = self.request.user
            currentProfile = Profile.objects.get(user = currentUser)

            
            unfollowedUser = User.objects.get(pk=id)
            unfollowedProfile = Profile.objects.get(user=unfollowedUser)


            follow = Follow.objects.get(follower=currentProfile, following=unfollowedProfile)
            follow.delete()
            return Response({"Details": "Deleted"})
        except:
            return Response({"Details": "Not Found"})




class UserSearch(generics.ListAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['user__username']

class UpdateIcon(generics.UpdateAPIView):
    parser_classes = [JSONParser, MultiPartParser]
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    
    def put(self, request, *args, **kwargs):
        profile = Profile.objects.get(user=self.request.user)
        profile.icon = request.data['file']
        profile.save()
        return Response(ProfileSerializer(profile).data)


class NotificationList(generics.ListCreateAPIView):

    serializer_class = NotificationSerializer



    def create(self, request, pk, *args, **kwargs):
        
        data = request.data
        current_user = self.request.user
        current_profile = Profile.objects.get(user=current_user)
        who_was_notified = Profile.objects.get(pk=pk)
        notifcation = Notification.objects.create(who_notified=current_profile, who_was_notified=who_was_notified,notification_type=data["description"], was_seen=False)

        if(data["description"] == "like"):
            post = Post.objects.get(pk=data["post"])
            notifcation.post = post
            
        notifcation.save()
        return Response(NotificationSerializer(notifcation).data)

                
    def get_queryset(self):
        
        current_user = self.request.user
        current_profile = Profile.objects.get(user=current_user)
        
        queryset = Notification.objects.filter(who_was_notified=current_profile)
        return queryset

class NotificationDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    

    def update(self, request, pk, *args, **kwargs):
        notification = Notification.objects.get(pk=pk)
        notification.was_seen = not notification.was_seen
        notification.save()
        return Response(NotificationSerializer(notification).data)
        


class NotificationCount(generics.RetrieveAPIView):

    def get(self, request, *args, **kwargs):
        current_profile = Profile.objects.get(user=self.request.user)
        return Response({"count":Notification.objects.filter(who_was_notified=current_profile,was_seen=False).count()})