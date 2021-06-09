import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  errors = {
    passwordDoentMatch: "As senhas precisam ser iguais",
    passwordTooShort: "A senha precisa ter pelo menos 8 caracteres"
  }

  currentError:string|undefined = undefined;


  registrationForm = new FormGroup({
    first_name: new FormControl(''),
    last_name: new FormControl(''),
    username: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    confirm_password: new FormControl('')
  })

  onSubmit(){
    let data = this.registrationForm.value;
    if(data.password !== data.confirm_password){
      this.currentError = this.errors.passwordDoentMatch;
      setTimeout(() => {
        this.currentError = undefined;
      }, 5000);
      return
    }
    if(data.password.length < 8){
      this.currentError = this.errors.passwordTooShort;
      setTimeout(() => {
        this.currentError = undefined;
      }, 5000);
      return
    }
    console.log(this.registrationForm.value);
  }
}
