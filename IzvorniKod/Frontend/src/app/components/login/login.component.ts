import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  userdata: any;

  constructor(private builder: FormBuilder, private userService: UserService,
    private router: Router) {

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
          
          this.router.navigate(['/dashboard']);
          this.userService.setCurrentUser(res);
      });
    } else {
      console.log("Error invalid form");
    }
  }
}