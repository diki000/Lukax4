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
  isAdmin$ : Observable<boolean> = new Observable<false>;

  constructor(private sidebarService: SidebarService, private userService: UserService) {
    let token = localStorage.getItem('jwt');
    this.isAdmin$ = this.userService.isAdmin();
    if(token != undefined){
      this.userService.updateLoggedInState(true);
      this.isAdmin$ = this.userService.isAdmin();
      this.userService.checkToken();
      this.currentUser = this.userService.getCurrentUser();
      if(this.currentUser!.RoleId == 2){
        this.sidebarService.setOpenCreateParking(true);
        this.sidebarService.setOpenStatistics(false);
      }
      if(this.currentUser!.RoleId == 1) {
        this.sidebarService.setOpenReservation(true);
        this.sidebarService.setOpenCreateParking(false);
        this.sidebarService.setOpenStatistics(false);
      }
      if(this.currentUser!.RoleId == 3){
        this.userService.updateAdminState(true);
      }

    }else{
      this.userService.updateLoggedInState(false);
      this.isAdmin$ = this.userService.isAdmin();
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
    this.sidebarService.setOpenReservation(false);
    this.sidebarService.setOpenFindParking(false);

  }

  otvoriStatistika():void {
    this.sidebarService.setOpenStatistics(true);
    this.sidebarService.setOpenCreateParking(false);
    this.sidebarService.setOpenReservation(false);
    this.sidebarService.setOpenFindParking(false);
  }

  otvoriRezerviraj():void {
    this.sidebarService.setOpenReservation(true);
    this.sidebarService.setOpenCreateParking(false);
    this.sidebarService.setOpenStatistics(false);
    this.sidebarService.setOpenFindParking(false);
  }

  otvoriRezervacija():void {
    this.sidebarService.setOpenReservation(true);
    this.sidebarService.setOpenCreateParking(false);
    this.sidebarService.setOpenStatistics(false);
    this.sidebarService.setOpenFindParking(false);
  }
  otvoriFindParking():void {
    this.sidebarService.setOpenFindParking(true);
    this.sidebarService.setOpenCreateParking(false);
    this.sidebarService.setOpenStatistics(false);
    this.sidebarService.setOpenReservation(false);
  }
}
