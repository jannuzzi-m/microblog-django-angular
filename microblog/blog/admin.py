from django.contrib import admin
from .models import Follow, Notification, Post, Like, Profile
admin.site.register(Follow)
admin.site.register(Post)
admin.site.register(Like)
admin.site.register(Profile)
admin.site.register(Notification)