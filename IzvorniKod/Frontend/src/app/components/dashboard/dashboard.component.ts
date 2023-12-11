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
  
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    if(localStorage.getItem('currentUser') != null){
      this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}'); 
    }
  }

}
