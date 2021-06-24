import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostsService } from '../posts.service';
import { Posts } from '../types/Posts';
import { UserService } from '../user.service';
import { Location } from '@angular/common';
import { DEFAULTICONPATH } from '../consts';
import { LikesService } from '../likes.service';
import { Profile } from '../types/Profile';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit {

  constructor(private router: ActivatedRoute, private postService: PostsService, private userService: UserService, private route: Router, private location: Location, private likeService: LikesService) { }
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

      this.postService.getPostFromServer(this.id).subscribe((res: Posts) => {
        res.owner.icon = res.owner.icon ? res.owner.icon : DEFAULTICONPATH
        this.post = res
        this.setIsMyPost(res)
      })
    }

  }

  setIsMyPost(post:Posts) {


    if(!this.userService.getBasicInfo()){
      this.userService.getBasicInfoFromServer().subscribe((res:Profile) => {
        console.log(res)
        if (res.id) {
          this.userService.setBasicInfo(res);  
        }
        this.isMyPost = res.id == post.owner.id 

      });
      
    }else{
      this.isMyPost = this.userService.getBasicInfo()?.id == post.owner.id
    }
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
  like() {
    if(!this.post) return
    this.likeService.like(this.post.id).subscribe(res => {
      if (this.post) {
        this.post.liked = true;
        this.post.like_count += 1
      }
    })
    
  }
  
  unLike() {
    if(!this.post) return
    this.likeService.unlike(this.post.id).subscribe(res => {
      if(this.post){
        this.post.liked = false;
        this.post.like_count -= 1

      }
    })


  }

}
