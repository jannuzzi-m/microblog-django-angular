import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  
  private token:string|undefined;
  
  getToken(){
    return this.token;
  }

  setToken(token:string){
    this.token = token;
  }

  test(){
    alert('test');
  }

  // getTokenFromServer(username:string ,password: string):Observable<any>{
  //   return 
  // }


}
