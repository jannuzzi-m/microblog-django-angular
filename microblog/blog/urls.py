from django.urls import path
from blog import views
from rest_framework.urlpatterns import format_suffix_patterns


urlpatterns = [
    path('users/', views.UserList.as_view()),
    path('basic-info/', views.BasicInfo.as_view()),
    path('users/<int:pk>/', views.UserDetail.as_view()),
    path('search/users/', views.UserSearch.as_view()),
    path('posts/', views.TimeLine.as_view()),
    path('posts/<int:pk>/', views.PostDetail.as_view()),
    path('users/posts/<int:id>/', views.PostFromUser.as_view()),
    path('likes/', views.LikesCreate.as_view()),
    # path('likes/<int:pk>/', views.LikeList.as_view()),
    path('follow/', views.FollowList.as_view()),
]



urlpatterns = format_suffix_patterns(urlpatterns)