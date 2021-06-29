from channels.generic.websocket import WebsocketConsumer
import json
from rest_framework.response import Response
from time import sleep
from random import randint


class WSConsumers(WebsocketConsumer):

    def connect(self):
        self.accept()
        self.send(json.dumps({"msg": "Ola amigo voce e um amigo"}))
        self.disconnect()
    
