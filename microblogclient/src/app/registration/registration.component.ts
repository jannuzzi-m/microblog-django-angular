import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Registration } from '../types/Registration';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  constructor(private userService: UserService, private route: Router) { }
  selectedFile: File|null = null;
  ngOnInit(): void {
  }
  errors = {
    passwordDoentMatch: "As senhas precisam ser iguais",
    passwordTooShort: "A senha precisa ter pelo menos 8 caracteres"
  }

  currentError: string | undefined = undefined;


  registrationForm = new FormGroup({
    first_name: new FormControl(''),
    last_name: new FormControl(''),
    username: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    confirm_password: new FormControl('')
  })

  onSubmit() {
    let data: Registration = this.registrationForm.value;
    if (data.password !== data.confirm_password) {
      this.currentError = this.errors.passwordDoentMatch;
      setTimeout(() => {
        this.currentError = undefined;
      }, 4000);
      return
    }
    if (data.password.length < 8) {
      this.currentError = this.errors.passwordTooShort;
      setTimeout(() => {
        this.currentError = undefined;
      }, 4000);
      return
    }



    const icon = new FormData();
    if(this.selectedFile){
      icon.append('image', this.selectedFile, this.selectedFile.name)
    }

    
    this.userService.createUser(data, icon).subscribe(res => {
      if (res.id) {

        this.userService.setUserBasicInfo(res);
        this.userService.getTokenFromServer(data.username, data.password).subscribe(res => {
          if (res.token) {
            this.userService.setToken(res.token)
            this.route.navigate(['dashboard'])
            return
          }
        })
        return

      }
    })
  }
  setCurrentFile(event: any) {
    this.selectedFile = event.target.files[0]
  }

}
