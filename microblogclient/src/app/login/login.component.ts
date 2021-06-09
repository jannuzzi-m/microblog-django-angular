import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    
  }

  userLogin = new FormGroup({
    username: new FormControl(''),
    password: new FormControl('')
  });

  onSubmit(){
    console.warn(this.userLogin.value);
  }

}
