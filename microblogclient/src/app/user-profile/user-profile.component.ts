import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostsService } from '../posts.service';
import { Posts } from '../types/Posts';
import { User } from '../types/User';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,
              private userService: UserService, 
              private postService: PostsService,
              private route:Router) {

  }
  id: string | null = null
  user: User | undefined
  posts: Posts[] = [];
  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    if (!this.userService.getToken()) {
      const currenToken = localStorage.getItem('token');
      if (currenToken) {
        this.userService.setToken(currenToken)
      }
    }
    if (this.id) {
      this.userService.getUser(this.id).subscribe(res => {
        this.user = res
      })
      this.postService.getPostFromUser(this.id).subscribe(res => {
        this.posts = res
        console.log(res)
      })
    }

  }
  seeDetail(id: number) {
    this.route.navigate([`post/${id}`])    
  }

  follow(){
    if(this.id){
      this.userService.follow(this.id).subscribe(res => {
        console.log(res)
      })

    }
  }

}
