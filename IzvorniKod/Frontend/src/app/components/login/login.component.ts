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

  

  constructor(private builder: FormBuilder, private userService: UserService,
    private router: Router) {

  }
  ngOnInit(): void {
      this.userService.logout();
      this.userService.updateLoggedInState(false);
      this.userService.updateAdminState(false);
      this.userService.updateKlijentState(false);
      
  }

  loginForm = this.builder.group({
    username: this.builder.control('', Validators.required),
    password: this.builder.control('', Validators.required)
  })

  proceedLogin() {
    if (this.loginForm.valid) {
      //this.userService.checkToken();
      let username = this.loginForm.value.username || "";
      let password = this.loginForm.value.password || "";
      this.userService.login(username, password).subscribe(
        (res : any) => {
          this.router.navigate(['/dashboard']);
          localStorage.setItem('jwt', res.accessToken)
          this.userService.checkToken();     
          let user = new User(res.userID, res.username, "", res.name, res.surname, "", res.email, false, res.roleID, res.accessToken);
          this.userService.setCurrentUser(user); 
          this.userService.updateLoggedInState(true);
          if(this.userService.getCurrentUser().roleID == 3){
            this.userService.updateAdminState(true);
          }
      }
      ,(error) => {
        window.alert("Invalid username or password")
        this.userService.updateLoggedInState(false);
        this.userService.updateAdminState(false);
      });
    } else {
    }
  }
}