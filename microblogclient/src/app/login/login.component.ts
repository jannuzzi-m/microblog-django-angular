import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private userService: UserService, private route: Router) { }

  ngOnInit(): void {

  }
  errors = {
    credentialsNotValid: "Usuario ou senha incorreto",
    usernameNotProvided: "O usuario não foi preenchoido",
    passwordNotProvided: "A senha não foi preenchida"
  }
  currentError: string | undefined = undefined;
  userLogin = new FormGroup({
    username: new FormControl(''),
    password: new FormControl('')
  });
  loading = false;

  onSubmit() {
    this.loading = true;
    const data: { username: string, password: string } = this.userLogin.value;

    if (!data.username) {
      this.triggerModal(this.errors.usernameNotProvided);
    } else if (!data.password) {
      this.triggerModal(this.errors.passwordNotProvided);
      return
    }


    this.userService.getTokenFromServer(data.username, data.password).subscribe(res => {
      if (res.token) {
        this.userService.setToken(res.token);
        this.route.navigate(['dashboard'])
        return
      }
      if (!res.token) {
        this.triggerModal(this.errors.credentialsNotValid);
      }
    })
    this.loading = false;
  }


  private triggerModal(error: string) {
    this.currentError = error;
    setTimeout(() => {
      this.currentError = undefined;
    }, 4000);
  }
}
