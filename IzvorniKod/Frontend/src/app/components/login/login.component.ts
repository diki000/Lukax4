import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  userdata: any;

  constructor(private builder: FormBuilder, private service: AuthService,
    private router: Router) {

  }

  loginForm = this.builder.group({
    username: this.builder.control('', Validators.required),
    password: this.builder.control('', Validators.required)
  })

  proceedLogin() {
    if (this.loginForm.valid) {
      this.service.Getbycode(this.loginForm.value.username).subscribe(res => {
        this.userdata = res;
        console.log(this.userdata);
      });
    } else {
      console.log("Error invalid form");
    }
  }