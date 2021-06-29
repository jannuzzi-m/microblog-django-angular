import { Component, OnInit } from '@angular/core';
import { UserBasicInfo } from '../types/UserBasicINfo';
import { UserService } from '../user.service';
import { FormControl, FormGroup } from '@angular/forms'
import { PostsService } from '../posts.service';
import { Posts } from '../types/Posts';
import { Router } from '@angular/router';
import { Profile } from '../types/Profile';

enum Tabs{
  user,
  timeline,
  search
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private userService: UserService, private postService: PostsService, private route:Router) { }
  selectedTab: Tabs = Tabs.timeline
  postData = new FormGroup({
    text: new FormControl('')
  })
  user: Profile | undefined;
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

    const ws = new WebSocket('ws://localhost:8000/ws/notifications/');
    ws.onmessage = event =>{
      const data = JSON.parse(event.data)
      console.log(data)
    }


  }

  togleTab(tab:Tabs){
    if(tab == this.selectedTab){
      this.selectedTab == Tabs.timeline
      console.log(this.selectedTab)
      return
    }
    
    if(tab == Tabs.user){
      this.selectedTab = Tabs.user
      console.log(this.selectedTab)
      return
    }
    if(tab == Tabs.timeline){
      this.selectedTab = Tabs.timeline
      console.log(this.selectedTab)
      return
    }
    if(tab == Tabs.search){
      this.selectedTab = Tabs.search
      console.log(this.selectedTab)
      return
    }
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
