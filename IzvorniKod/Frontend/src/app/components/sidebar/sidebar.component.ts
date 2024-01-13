import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/User';
import { SidebarService } from 'src/app/services/sidebar.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements  OnInit{

  currentUser : User | null = null;
  

  constructor(private sidebarService: SidebarService, private userService: UserService) {
    let token = localStorage.getItem('jwt');
    if(token != undefined){
      this.userService.updateLoggedInState(true);
      this.userService.checkToken();
      this.currentUser = this.userService.getCurrentUser();
      if(this.currentUser!.RoleId == 2){
        this.sidebarService.setOpenCreateParking(true);
        this.sidebarService.setOpenStatistics(false);
      }

    }else{
      this.userService.updateLoggedInState(false);
      this.currentUser = null;
    }

  }

  ngOnInit(): void {
  }

  smanji():void {
    const body = document.querySelector("body");
    const sidebar = body?.querySelector(".sidebar");
    sidebar?.classList.toggle("close");
  }

  otvoriStvoriParking():void {
    this.sidebarService.setOpenCreateParking(true);
    this.sidebarService.setOpenStatistics(false);

  }

  otvoriStatistika():void {
    this.sidebarService.setOpenCreateParking(false);
    this.sidebarService.setOpenStatistics(true);
  }
}
