from django.db import models
from django.contrib.auth.models import User
from django.db.models.deletion import CASCADE
from django.db.models.fields import related


def get_image_name(icon, filename):
    return f"{icon.id}-{filename}"


class Profile(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    icon = models.ImageField(upload_to=get_image_name, blank=True, null=True)


    def __str__(self) -> str:
        return self.user.username


class Post(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    body = models.CharField(max_length=240)
    owner = models.ForeignKey(Profile, related_name='post', on_delete=models.CASCADE)


    def __str__(self) -> str:
        return self.body


class Like(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    post = models.ForeignKey(Post, related_name='post', on_delete=models.CASCADE)
    who_liked = models.ForeignKey(Profile, related_name='who_liked', on_delete=models.CASCADE)


    def __str__(self) -> str:
        return f'{self.who_liked.user.username} likes {self.post}'


class Follow(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    follower = models.ForeignKey(Profile, related_name='follower', on_delete=models.CASCADE)
    following = models.ForeignKey(Profile, related_name='following', on_delete=models.CASCADE)
    

    def __str__(self) -> str:
        return f'{self.follower} follows {self.following}'


class Notification(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    who_notified = models.ForeignKey(Profile, related_name='user_from', on_delete=models.CASCADE)
    who_was_notified = models.ForeignKey(Profile, related_name='user_to', on_delete=models.CASCADE)
    notification_type = models.CharField(max_length=120, blank=False)
    was_seen = models.BooleanField(default=False)
    post = models.ForeignKey(Post ,related_name="post_liked", null=True, blank=True, on_delete=models.CASCADE)


    def __str__(self) -> str:
        return f'{self.who_notified} {self.notification_type} {self.who_was_notified}'
        