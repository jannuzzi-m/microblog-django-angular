import { Component, OnInit } from '@angular/core';
import { UserBasicInfo } from '../types/UserBasicINfo';
import { UserService } from '../user.service';
import { FormControl, FormGroup } from '@angular/forms'
import { PostsService } from '../posts.service';
import { Posts } from '../types/Posts';
import { Router } from '@angular/router';
import { Profile } from '../types/Profile';
import { DEFAULTICONPATH } from '../consts';
import { LikesService } from '../likes.service';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {


  constructor(private userService: UserService, private postService: PostsService, private route: Router, private likeService: LikesService) { }

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
      res.map((res: Posts) => res.owner.icon = res.owner.icon ? res.owner.icon : DEFAULTICONPATH)
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
      console.log(res)
      this.postService.addPost(res)
      this.updatePosts()
      this.postData.reset()

    }
    )
  }
  updatePosts() {
    this.posts = this.postService.getPosts()
  }


  seeDetail(id: number) {
    this.route.navigate([`post/${id}`])
  }

  like(id: number) {
    this.likeService.like(id).subscribe(res => {
      console.log(res)
        this.posts = this.posts.map((p: Posts) => p.id == id ? { ...p, liked: true, like_count: p.like_count + 1 } : p)
    })
  }
  
  unLike(id: number) {
    this.likeService.unlike(id).subscribe(res => {

        this.posts = this.posts.map((p: Posts) => p.id == id ? { ...p, liked: false, like_count: p.like_count - 1 } : p)
    })


  }
}


