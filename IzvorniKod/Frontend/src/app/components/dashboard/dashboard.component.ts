import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/User';
import { SidebarService } from 'src/app/services/sidebar.service';
import { UserService } from 'src/app/services/user.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{

  currentUser : User | null = null;
  isLoggedIn$ : Observable<boolean> | undefined;
  openCreateParking: Observable<boolean> = new Observable<false>;
  openStatistics: Observable<boolean> = new Observable<false>;
  openReservation: Observable<boolean> = new Observable<false>;


  constructor(private userService: UserService, private sidebarService: SidebarService) {
    let token = localStorage.getItem('jwt');
    this.isLoggedIn$ = this.userService.isLoggedIn();

    if(token != undefined){
      this.userService.updateLoggedInState(true);
      this.userService.checkToken();
      this.currentUser = this.userService.getCurrentUser(); 
      if(this.currentUser?.RoleId == 1){
        this.userService.updateKlijentState(true);
      }
      else{
        this.userService.updateKlijentState(false);
      }
    }
    else{
      this.userService.updateLoggedInState(false);
      this.currentUser = null;
    }
  }

  ngOnInit(): void {
      this.userService.checkToken();
      this.currentUser = this.userService.getDecodedToken();
      if(this.currentUser != null){
        this.userService.updateLoggedInState(true);
        if(this.currentUser.RoleId == 1){
          this.sidebarService.setOpenCreateParking(false);
          this.sidebarService.setOpenStatistics(false);
          this.userService.updateAdminState(false);
        }
      }
      this.openCreateParking = this.sidebarService.openCreateParking$;
      this.openStatistics = this.sidebarService.openStatistics$;
      this.openReservation = this.sidebarService.openReservation$;
    }

}
