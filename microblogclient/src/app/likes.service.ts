import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class LikesService {

  constructor(private userService:UserService, private http: HttpClient) { }

  like(id:number):Observable<any>{
    return this.http.post("http://localhost:8000/likes/", {post: id}, this.userService.getHeaders())
  }
  unlike(id:number):Observable<any>{
    return this.http.delete(`http://localhost:8000/likes/${id}/`, this.userService.getHeaders())
  }
}
