import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpResponseBase } from '@angular/common/http'
import { catchError } from 'rxjs/operators';
import { Registration } from './types/Registration';
import { UserBasicInfo } from './types/UserBasicINfo';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private route:Router) { }

  
  private token:string|undefined;
  private userBasicInfo: UserBasicInfo| undefined;

  setUserBasicInfo(info:UserBasicInfo){
    this.userBasicInfo = info
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
    return this.http.post('http://localhost:8000/api-token-auth/',{
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
    return this.http.get(`http://localhost:8000/users/${id}/`, this.getHeaders())
  }

  createUser(data:Registration):Observable<any>{
    return this.http.post('http://localhost:8000/users/',{
      first_name: data.first_name,
      last_name: data.last_name,
      username: data.username,
      email: data.email,
      password: data.password
    }).pipe(
      catchError(this.handleError({}))
    )

  }

  setBasicInfo(basicInfo: UserBasicInfo){
    this.userBasicInfo = basicInfo
  } 

  getBasicInfo(){
    return this.userBasicInfo
  }

  getBasicInfoFromServer():Observable<any>{
    return this.http.get('http://localhost:8000/basic-info/', this.getHeaders())
  }

  logout(){
    localStorage.removeItem('token');
    this.setToken(undefined)
    this.route.navigate(['login'])
  }

  getSearchUsers(param: string):Observable<any>{
    return this.http.get(`http://localhost:8000/search/users/`,{
      params:{
        search: param
      }
    }).pipe(
      catchError(this.handleError([]))
    )
  }

  follow(id:string):Observable<any>{
      return this.http.post('http://localhost:8000/follow/',{
        user: id
      }, this.getHeaders()).pipe(
        catchError(this.handleError({}))
      )
  
  }

}
