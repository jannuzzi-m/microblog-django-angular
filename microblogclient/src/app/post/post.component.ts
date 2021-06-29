import { AfterContentChecked, AfterViewChecked, Component,
   Input,
   OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LikesService } from '../likes.service';
import { PostsService } from '../posts.service';
import { Posts } from '../types/Posts';
import { UserService } from '../user.service';
import { Location } from '@angular/common';
import { Profile } from '../types/Profile';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit, AfterContentChecked {

  constructor(private router: ActivatedRoute,
     private postService: PostsService,
     private userService: UserService,
     private route: Router,
     private likeService: LikesService,
     private location: Location) { }
  ngAfterContentChecked(): void {
      if(this.post)
        this.setIsMyPost(this.post)
  }
     isMyPost= true;
     @Input() showDelete:boolean = false;
     @Input() post: Posts | undefined;
     ngOnInit(): void {
       
       
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
    if (this.post) {
        this.postService.deletePost(this.post.id.toString()).subscribe(res => {
          if (this.post) 
            this.postService.removePost(this.post.id.toString())
            this.location.back()
      })

    }
  }
  like() {
    if (!this.post) return
    this.likeService.like(this.post.id).subscribe(res => {
      if (this.post) {
        this.post.liked = true;
        this.post.like_count += 1
      }
    })

  }

  unLike() {
    if (!this.post) return
    this.likeService.unlike(this.post.id).subscribe(res => {
      if (this.post) {
        this.post.liked = false;
        this.post.like_count -= 1

      }
    })


  }
  showPost(){
    console.log(this.post)
  }

}
