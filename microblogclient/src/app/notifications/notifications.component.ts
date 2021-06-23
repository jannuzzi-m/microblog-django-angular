import { Component, OnInit } from '@angular/core';
import { API_ROOT, DEFAULTICONPATH } from '../consts';
import { NotificationsService } from '../notifications.service';
import { Notification } from '../types/Notification'
import { UserService } from '../user.service';
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  constructor(private userService: UserService, private notificationService: NotificationsService, ) { }
  notifications: Notification[] = []
  ngOnInit(): void {
    if (!this.userService.getToken()) {
      const currenToken = localStorage.getItem('token');
      if (currenToken) {
        this.userService.setToken(currenToken)
      }
    }
  
    this.notificationService.getNotifications().subscribe(res =>{
      res.map((n: Notification) => {
        n.who_notified.icon = n.who_notified.icon? n.who_notified.icon:DEFAULTICONPATH
      })
      console.log(res)
      this.notifications = res
    })
  
  }

  toggleNotificationSeen(id:number){
    this.notificationService.updateNotificationAsSeen(id).subscribe(res => {
      this.notifications.map((n:Notification) => {
        return n.id == id? n : {...n, was_seen: false}
      })
      console.log(res)
    });
  }

}
