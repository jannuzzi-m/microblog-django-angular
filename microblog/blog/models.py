from django.db import models
from django.contrib.auth.models import User
from django.db.models.deletion import CASCADE


class Post(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    body = models.CharField(max_length=240)
    owner = models.ForeignKey('auth.User', related_name='post', on_delete=models.CASCADE)
    likes  = models.ManyToManyField(User, default=[], blank=True, related_name='who_liked')


    def __str__(self) -> str:
        return self.body
    

class Follow(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    follower = models.ForeignKey('auth.User', related_name='follower', on_delete=models.CASCADE)
    following = models.ForeignKey('auth.User', related_name='following', on_delete=models.CASCADE)
    

    def __str__(self) -> str:
        return f'{self.follower} follows {self.following}'
        