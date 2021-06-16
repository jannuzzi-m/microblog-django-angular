from django.db import models
from django.contrib.auth.models import User
from django.db.models.deletion import CASCADE


class Post(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    body = models.CharField(max_length=240)
    owner = models.ForeignKey('auth.User', related_name='post', on_delete=models.CASCADE)
    # like_count  = models.PositiveIntegerField(default=0)


    def __str__(self) -> str:
        return self.body

class UserProfile(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE)


class Like(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    post = models.ForeignKey(Post, related_name='post', on_delete=models.CASCADE)
    who_liked = models.ForeignKey(User, related_name='who_liked', on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f'{self.who_liked} likes {self.post}'


class Follow(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    follower = models.ForeignKey('auth.User', related_name='follower', on_delete=models.CASCADE)
    following = models.ForeignKey('auth.User', related_name='following', on_delete=models.CASCADE)
    

    def __str__(self) -> str:
        return f'{self.follower} follows {self.following}'
        