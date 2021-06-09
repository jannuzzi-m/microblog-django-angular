import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Posts } from './types/Posts';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';


@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private http: HttpClient, private userService: UserService ) { }

  posts:Posts[] = [
    {
      id: 0,
      owner: 'jannuzzi',
      body: 'first post'
    },
    {
      id: 1,
      owner: 'alguem',
      body: 'second post'
    },
    {
      id: 2,
      owner: 'anonimo',
      body: 'third post bigger then the others'
    },
    {
      id: 3,
      owner: 'alalalalla',
      body: 'post grande de mais escxreve escreve escreve escreve...'
    },
    {
      id: 0,
      owner: 'jannuzzi',
      body: 'first post'
    },
    {
      id: 1,
      owner: 'alguem',
      body: 'second post'
    },
    {
      id: 2,
      owner: 'anonimo',
      body: 'third post bigger then the others'
    },
    {
      id: 3,
      owner: 'alalalalla',
      body: 'post grande de mais escxreve escreve escreve escreve...'
    },
    {
      id: 0,
      owner: 'jannuzzi',
      body: 'first post'
    },
    {
      id: 1,
      owner: 'alguem',
      body: 'second post'
    },
    {
      id: 2,
      owner: 'anonimo',
      body: 'third post bigger then the others'
    },
    {
      id: 3,
      owner: 'alalalalla',
      body: 'post grande de mais escxreve escreve escreve escreve...'
    },
    {
      id: 0,
      owner: 'jannuzzi',
      body: 'first post'
    },
    {
      id: 1,
      owner: 'alguem',
      body: 'second post'
    },
    {
      id: 2,
      owner: 'anonimo',
      body: 'third post bigger then the others'
    },
    {
      id: 3,
      owner: 'alalalalla',
      body: 'post grande de mais escxreve escreve escreve escreve...'
    },
  ]

  getPosts(){
    return this.posts;
  }

  sendPostFromSever(body: string):Observable<any>{
    return this.http.post('http://localhost:8000/posts/', {
      body
    }, this.userService.getHEaders()) 
  }
}
