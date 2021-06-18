import { Component, OnInit } from '@angular/core';
import { UserBasicInfo } from '../types/UserBasicINfo';
import { UserService } from '../user.service';
import { FormControl, FormGroup } from '@angular/forms'
import { PostsService } from '../posts.service';
import { Posts } from '../types/Posts';
import { Router } from '@angular/router';
import { Profile } from '../types/Profile';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {

  constructor(private userService: UserService, private postService: PostsService, private route: Router) { }


  profile: Profile | undefined;
  // posts: Posts[] = [];


  ngOnInit(): void {
    this.userService.getBasicInfoFromServer().subscribe(res => {
      console.log(res)
      if (res.id) {
        this.userService.setBasicInfo(res);
        this.profile = this.userService.getBasicInfo();

      }
    });
  }

  logout() {
    this.userService.logout()
  }

  getIconPath() {
    
    return `http://localhost:8000${this.profile?.icon}`;
    
  }

}
