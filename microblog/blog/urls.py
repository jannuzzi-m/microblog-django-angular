from django.urls import path
from blog import views
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
    path('users/', views.UserList.as_view()),
    path('users/', views.UserDetail.as_view()),
    path('posts/', views.PostList.as_view()),
    path('posts/<int:pk>/', views.PostDetail.as_view()),
    path('likes/', views.LikesList.as_view()),
    path('follow/', views.FollowList.as_view()),
]



urlpatterns = format_suffix_patterns(urlpatterns)