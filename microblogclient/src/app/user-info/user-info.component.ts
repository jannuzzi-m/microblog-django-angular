import { Component, OnInit } from '@angular/core';
import { UserBasicInfo } from '../types/UserBasicINfo';
import { UserService } from '../user.service';
import { FormControl, FormGroup } from '@angular/forms'
import { PostsService } from '../posts.service';
import { Posts } from '../types/Posts';
import { Router } from '@angular/router';
import { Profile } from '../types/Profile';
import { API_ROOT, API_PATHS, DEFAULTICONPATH } from '../consts';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {

  constructor(private userService: UserService, private postService: PostsService, private route: Router) { }


  profile: Profile | undefined;
  // posts: Posts[] = [];
  notificationCount:number = 0;


  ngOnInit(): void {
    this.userService.getBasicInfoFromServer().subscribe(res => {
      console.log(res)
      if(!res.icon){
        res.icon = DEFAULTICONPATH
      }else{
        res.icon = this.getIconPath(res.icon)
      }
      if (res.id) {
        this.userService.setBasicInfo(res);
        this.profile = this.userService.getBasicInfo();

      }
    });
    this.userService.getNotificationCount().subscribe(res => {
      if(res)
        this.notificationCount = res.count
    })
  }

  logout() {
    this.userService.logout()
  }

  getIconPath(path:string) {
    
    return `http://localhost:8000${path}`;
    
  }

}
