import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpResponseBase } from '@angular/common/http'
import { catchError } from 'rxjs/operators';
import { Registration } from './types/Registration';
import { UserBasicInfo } from './types/UserBasicINfo';
import { Router } from '@angular/router';
import { Profile } from './types/Profile';
import {API_ROOT, API_PATHS} from './consts';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private route:Router) { }

  
  private token:string|undefined;
  private userProfile: Profile| undefined;

  setUserBasicInfo(info:Profile){
    this.userProfile = info
  }
  getHeaders(){
    return{
      headers: new HttpHeaders({
        Authorization: `Token ${this.getToken()}`
    
      })
    }
    
  }
  getToken(){
    return this.token;
  }

  setToken(token:string|undefined){
    this.token = token;
  }

  getTokenFromServer(username:string, password:string): Observable<any>{
    return this.http.post(API_ROOT + API_PATHS.auth,{
      username,
      password
    })
    .pipe(
      catchError(this.handleError({}))
    )
  }
  
  private handleError<T>(result?: T){
    return (error: HttpResponseBase): Observable<T> => {
      if(error.status == 400){

      }
      return of(result as T)
    }
  }

  getUser(id:string):Observable<any>{
    return this.http.get(API_ROOT+API_PATHS.profile+id+'/', this.getHeaders())
  }

  createUser(data:Registration):Observable<any>{
    
    return this.http.post(API_ROOT+API_PATHS.users,{
      first_name: data.first_name,
      last_name: data.last_name,
      username: data.username,
      email: data.email,
      password: data.password
    }).pipe(
      catchError(this.handleError({}))
    )

  }

  setBasicInfo(basicInfo: Profile){
    this.userProfile = basicInfo
  } 

  getBasicInfo(){
    return this.userProfile
  }

  getBasicInfoFromServer():Observable<any>{
    return this.http.get(API_ROOT+API_PATHS.basicInfo, this.getHeaders())
  }

  logout(){
    localStorage.removeItem('token');
    this.setToken(undefined)
    this.route.navigate(['login'])
  }

  getSearchUsers(param: string):Observable<any>{
    return this.http.get(API_ROOT+API_PATHS.searchUsers,{
      params:{
        search: param
      }
    }).pipe(
      catchError(this.handleError([]))
    )
  }

  follow(id:string):Observable<any>{
      return this.http.post(API_ROOT+API_PATHS.follow,{
        user: id
      }, this.getHeaders()).pipe(
        catchError(this.handleError({}))
      )
  }
  unfollow(id:string):Observable<any>{
      return this.http.delete(API_ROOT+API_PATHS.follow+id+'/', this.getHeaders())
  }

  updateIcon(file: FormData):Observable<any>{
    let headers = this.getHeaders();
    headers.headers.set('Authorization', `Token ${this.getToken()}`)
    headers.headers.set('Content-Type', 'multipart/form-data');
    headers.headers.set('Content-Disposition', `${this.userProfile?.id || new Date().toString()}`);
    return this.http.put(API_ROOT+API_PATHS.updateIcon, file, headers)
  }

}
