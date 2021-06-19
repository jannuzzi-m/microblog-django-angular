import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostsService } from '../posts.service';
import { Posts } from '../types/Posts';
import { UserService } from '../user.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit {

  constructor(private router: ActivatedRoute, private postService: PostsService, private userService: UserService, private route: Router, private location:Location) { }
  id: string | null | undefined;
  post: Posts | undefined;
  isMyPost = false;
  ngOnInit(): void {
    const param = this.router.snapshot.paramMap.get('id');
    this.id = param;
    if (this.id) {
      if (!this.userService.getToken()) {
        const currenToken = localStorage.getItem('token');
        if (currenToken) {
          this.userService.setToken(currenToken)
        }
      }
      this.postService.getPostFromServer(this.id).subscribe(res => {
        this.post = res
        //  this.route.navigate(['dashboard'])
        this.isMyPost = this.setIsMyPost()
      })
    }


  }

  setIsMyPost() {
    console.log(this.post)
    return this.userService.getBasicInfo()?.id == this.post?.owner.id
  }

  deletePost() {
    if (this.id) {
      this.postService.deletePost(this.id).subscribe(res => {
        console.log(res);
        this.postService.removePost(this.id)
        this.location.back()
      })

    }
  }

}
