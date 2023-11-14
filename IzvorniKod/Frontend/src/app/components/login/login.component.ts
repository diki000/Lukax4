import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{

  userdata: any;

  constructor(private builder: FormBuilder, private userService: UserService,
    private router: Router) {

  }
  ngOnInit(): void {
    this.userService.logout();
  }

  loginForm = this.builder.group({
    username: this.builder.control('', Validators.required),
    password: this.builder.control('', Validators.required)
  })

  proceedLogin() {
    if (this.loginForm.valid) {
      let username = this.loginForm.value.username || "";
      let password = this.loginForm.value.password || "";
      this.userService.login(username, password).subscribe(
        (res) => {
          this.userdata = res;
          console.log(this.userdata);
          this.userService.updateLoggedInState(true);
          this.router.navigate(['/dashboard']);
          this.userService.setCurrentUser(res);
          let currentUser = {
            username: res.Username,
            email: res.Email,
            firstName: res.Name,
            lastName: res.Surname,
            role: res.RoleId,
          }
          localStorage.setItem('currentUser', JSON.stringify(res))
      }
      ,(error) => {
        window.alert("Invalid username or password")
        this.userService.updateLoggedInState(false);
      });
    } else {
    }
  }
}