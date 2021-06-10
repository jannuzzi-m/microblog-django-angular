import { Component, OnInit } from '@angular/core';
import { UserBasicInfo } from '../types/UserBasicINfo';
import { UserService } from '../user.service';
import { FormControl, FormGroup } from '@angular/forms'
import { PostsService } from '../posts.service';
import { Posts } from '../types/Posts';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private userService: UserService, private postService: PostsService, private route:Router) { }

  postData = new FormGroup({
    text: new FormControl('')
  })
  user: UserBasicInfo | undefined;
  posts: Posts[] = [];


  ngOnInit(): void {
    if (!this.userService.getToken()) {
      const currenToken = localStorage.getItem('token');
      if (currenToken) {
        this.userService.setToken(currenToken)
      }
    }
    this.userService.getBasicInfoFromServer().subscribe(res => {
      if (res.id) {
        this.userService.setBasicInfo(res);
        this.user = this.userService.getBasicInfo();

      }
    });
    this.postService.getPostsFromServer().subscribe(res => {
      this.postService.setPosts(res)
      this.updatePosts()
    })


  }



  postToServer() {
    const data = this.postData.value
    if (!data.text) {
      return
    }
    this.postService.sendPostFromSever(data.text).subscribe(res => {
      this.postService.addPost(res)
      this.updatePosts()
      this.postData.reset()

    }
    )
  }
  updatePosts() {
    this.posts = this.postService.getPosts()
  }
  logout() {
    this.userService.logout()
  }

  seeDetail(id:number){
    this.route.navigate([`post/${id}`])    
  }

}
