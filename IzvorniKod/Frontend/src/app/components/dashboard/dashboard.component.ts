import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/User';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{

  currentUser : any;
  
  constructor(private userService: UserService) {
    let token = localStorage.getItem('jwt');
    if(token != undefined){
      this.userService.updateLoggedInState(true);
    }
  }

  ngOnInit(): void {
      this.userService.checkToken();
      this.currentUser = this.userService.getDecodedToken();
  }

}
