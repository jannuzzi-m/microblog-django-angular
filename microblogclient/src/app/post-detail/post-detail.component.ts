import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostsService } from '../posts.service';
import { Posts } from '../types/Posts';
import { UserService } from '../user.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit {

  constructor(private route:ActivatedRoute, private postService: PostsService, private userService: UserService) { }
  id: string|null|undefined;
  post: Posts| undefined;
  ngOnInit(): void {
   const param = this.route.snapshot.paramMap.get('id');
   this.id = param;
   if(this.id){
    if (!this.userService.getToken()) {
      const currenToken = localStorage.getItem('token');
      if (currenToken) {
        this.userService.setToken(currenToken)
      }
    }
     this.postService.getPostFromServer(this.id).subscribe(res => {
       this.post = res
     })
   }

    
  }

}
