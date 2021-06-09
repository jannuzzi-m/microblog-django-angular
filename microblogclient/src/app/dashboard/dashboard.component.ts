import { Component, OnInit } from '@angular/core';
import { UserBasicInfo } from '../types/UserBasicINfo';
import { UserService } from '../user.service';
import { FormControl, FormGroup } from '@angular/forms'
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private userService: UserService, private postService:  PostsService) { }

  postData = new FormGroup({
    text: new FormControl('')
  })
  user: UserBasicInfo| undefined;
  // user = {
  //   id: 1,
  //   username: 'jannuzzi',
  //   first_name: 'marcelino',
  //   last_name: 'jannuzzi',
  //   email: 'j@j.com'
  // };
  

  ngOnInit(): void {
    this.userService.getBasicInfoFromServer().subscribe(res =>{
      if(res.id){
        this.userService.setBasicInfo(res);
        this.user = this.userService.getBasicInfo();
      }
    });
  }

  posts = this.postService.getPosts()

  postToServer(){
    const data = this.postData.value
    this.postService.sendPostFromSever(data.text).subscribe(res =>
      console.log(res)
    )
  }

}
