import { Injectable } from '@angular/core';
import { Observable, Observer, of } from 'rxjs';
import { Posts } from './types/Posts';
import { HttpClient, HttpResponseBase } from '@angular/common/http';
import { UserService } from './user.service';
import { catchError } from 'rxjs/operators';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private http: HttpClient, private userService: UserService) { }

  posts: Posts[] = []

  getPosts() {
    return this.posts;
  }

  sendPostFromSever(body: string): Observable<any> {
    return this.http.post('http://localhost:8000/posts/', {
      body
    }, this.userService.getHeaders())
  }

  getPostsFromServer(): Observable<any> {
    return this.http.get('http://localhost:8000/posts/', this.userService.getHeaders())
      .pipe(
        catchError(this.handleError([]))
      )
  }

  private handleError<T>(result?: T) {
    return (error: HttpResponseBase): Observable<T> => {
      if (error.status == 400) {

      }
      return of(result as T)
    }
  }

  setPosts(posts: Posts[]){
    this.posts = posts
  }

  addPost(post: Posts){
    this.posts = [post,...this.posts]
  }

  removePost(id: string|null|undefined){
    if(!id) return
    let i = parseInt(id);
    this.posts = this.posts.filter(p => p.id !== i)
  }

  getPostFromServer(id:string):Observable<any>{
    return this.http.get(`http://localhost:8000/posts/${id}/`, this.userService.getHeaders())
      .pipe(
        catchError(this.handleError({}))
      )
  }
  
  deletePost(id:string|null|undefined):Observable<any>{
    return this.http.delete(`http://localhost:8000/posts/${id}/`, this.userService.getHeaders())
      .pipe(
        catchError(this.handleError({}))
      )
  }

  
}