import { HttpClient, HttpResponseBase } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(private userService: UserService, private http: HttpClient) { }

  getNotificationCount():Observable<any>{
    return this.http.get("http://localhost:8000/users/notication/count/", this.userService.getHeaders())
    .pipe(
      catchError(this.handleError({}))
    )
  }

  getNotifications():Observable<any>{
    return this.http.get("http://localhost:8000/users/notication/", this.userService.getHeaders())
    .pipe(
      catchError(this.handleError([]))
    )
  }

  updateNotificationAsSeen(id: number):Observable<any>{
    return this.http.put(`http://localhost:8000/users/notication/update/${id}/`, this.userService.getHeaders())
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


}
