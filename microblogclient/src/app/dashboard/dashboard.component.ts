import { Component, OnInit } from '@angular/core';
import { UserBasicInfo } from '../types/UserBasicINfo';
import { UserService } from '../user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private userService: UserService) { }
  user:UserBasicInfo| undefined;

  ngOnInit(): void {
    this.userService.getBasicInfoFromServer().subscribe(res =>{
      if(res.id){
        this.userService.setBasicInfo(res);
        this.user = this.userService.getBasicInfo();
      }
    });
  }

}
