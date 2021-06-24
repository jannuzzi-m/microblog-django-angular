import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostsService } from '../posts.service';
import { Posts } from '../types/Posts';
import { Profile } from '../types/Profile';
import { User } from '../types/User';
import { UserService } from '../user.service';
import { API_ROOT, DEFAULTICONPATH } from '../consts'
import { LikesService } from '../likes.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private postService: PostsService,
    private route: Router,
    private likeService: LikesService) {

  }
  icon: string = ''
  curerentFile: File|null = null;
  isCurrentUser: boolean = false;
  isFollowing: boolean = false;
  id: string | null = null
  user: Profile | undefined
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
        if(!res.icon){
          this.icon = DEFAULTICONPATH
        }else{
          this.icon = res.icon
        }
        console.log(res)
        this.user = res
        this.isFollowing = res.user.following
      })
      this.postService.getPostFromUser(this.id).subscribe(res => {
        res.map((res:Posts) => res.owner.icon = res.owner.icon?res.owner.icon: DEFAULTICONPATH)
        this.posts = res
      })
    }
    if (this.id && this.userService.getBasicInfo()) {
      let result = parseInt(this.id) == this.userService.getBasicInfo()?.id


      this.isCurrentUser = (parseInt(this.id) == this.userService.getBasicInfo()?.id)
    }

  }
  seeDetail(id: number) {
    this.route.navigate([`post/${id}`])
  }

  follow() {
    if (this.id) {
      this.userService.follow(this.id).subscribe(res => {
        console.log(res)
      })

    }
    if (this.user) {
      this.isFollowing = true
    }
  }

  unfollow() {
    if (this.id)
      this.userService.unfollow(this.id).subscribe(res => {
        console.log(res)
        this.isFollowing = false
      })
  }
  clickImageInput(){
    if(!this.isCurrentUser) return
    let fileInput = document.getElementById("input-file-hidden");
    fileInput?.click()

  }

  setCurrentFile(event:any){
    this.curerentFile = event.target.files[0]
    if(!this.curerentFile) return
    const fileForm = new FormData()
    fileForm.append('file', this.curerentFile)
    this.userService.updateIcon(fileForm).subscribe(res => {
      if(res.icon && this.user)
        this.user.icon = API_ROOT+res.icon
        this.icon = API_ROOT+res.icon
    })
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
