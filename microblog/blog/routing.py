from django.urls import path
from blog.WSConsumers import WSConsumers

ws_urlpatterns = [
    path('ws/notifications/', WSConsumers.as_asgi())
]