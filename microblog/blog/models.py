from django.db import models

class Post(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    body = models.CharField(max_length=240)
    owner = models.ForeignKey('auth.User', related_name='post', on_delete=models.CASCADE)

  
class Like(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='like')
    who_liked = models.ForeignKey('auth.User', related_name='like', on_delete=models.CASCADE)
    

class Follow(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    follower = models.ForeignKey('auth.User', related_name='follower', on_delete=models.CASCADE)
    following = models.ForeignKey('auth.User', related_name='following', on_delete=models.CASCADE)