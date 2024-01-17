import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/User';
import { SidebarService } from 'src/app/services/sidebar.service';
import { UserService } from 'src/app/services/user.service';
import * as L from 'leaflet';
import { ParkingService } from 'src/app/services/parking.service';

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

  reservations: any[] = [];
  parking : any[] = [];
  loaded = false;

  constructor(private userService: UserService, private sidebarService: SidebarService, private parkingService: ParkingService) {
    let token = localStorage.getItem('jwt');
    this.isLoggedIn$ = this.userService.isLoggedIn();
    if(token != undefined){
      this.userService.updateLoggedInState(true);
      this.userService.checkToken();
      this.currentUser = this.userService.getCurrentUser(); 
    }
    else{
      this.userService.updateLoggedInState(false);
      this.currentUser = null;
    }
    
  }

  ngOnInit(): void {
      this.userService.checkToken();
      this.currentUser = this.userService.getDecodedToken();
      this.openCreateParking = this.sidebarService.openCreateParking$;
      this.openStatistics = this.sidebarService.openStatistics$;
      this.openReservation = this.sidebarService.openReservation$;

      this.userService.getAllReservationsForUser(this.currentUser!.UserId).subscribe((data) => {
        this.reservations = data.sort((a: any, b: any) => new Date(a.reservationDate).getTime() - new Date(b.reservationDate).getTime());
        console.log(data);
        this.parkingService.getAllParkings().subscribe((data1) => {
          this.parking = data1;
          console.log(data1);
          this.reservations.forEach((reservation: any) => {
            let matchingParking = {}
            this.parking.forEach((parking: any) => {
              parking.parkingSpaces.forEach((parkingSpace: any) => {
                if (parkingSpace.parkingSpaceId == reservation.parkingSpaceID) {
                  matchingParking = parking;
                }
              })
            }
            );
      
            if (matchingParking) {
              reservation.parkingData = matchingParking;
            }
          });

          console.log(this.reservations);
          this.loaded = true;
        })
      })

    }

    findParking(id: number) {
      return this.parking.find((x) => x.ParkingId == id);
    }


}
