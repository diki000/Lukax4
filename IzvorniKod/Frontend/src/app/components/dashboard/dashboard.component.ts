import { Component, OnInit ,ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/User';
import { SidebarService } from 'src/app/services/sidebar.service';
import { UserService } from 'src/app/services/user.service';
import * as L from 'leaflet';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RegisteredMapComponent } from '../registered-map/registered-map.component';
import { ParkingService } from 'src/app/services/parking.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{

  currentUser : User | null = null;
  isLoggedIn$ : Observable<boolean> = new Observable<false>;
  isAdmin$ : Observable<boolean> = new Observable<false>;
  openCreateParking: Observable<boolean> = new Observable<false>;
  openStatistics: Observable<boolean> = new Observable<false>;
  openReservation: Observable<boolean> = new Observable<false>;
  openFindParking: Observable<boolean> = new Observable<false>;
  placanje : number = 1;
  pocetak : string = "";
  kraj : string = "";
  reservations: any[] = [];
  parking : any[] = [];
  loaded = false;  

  constructor(private userService: UserService, private sidebarService: SidebarService, private parkingService:ParkingService) {
    let token = localStorage.getItem('jwt');
    this.isLoggedIn$ = this.userService.isLoggedIn();
    this.isAdmin$ = this.userService.isAdmin();

    if(token != undefined){
      this.userService.updateLoggedInState(true);
      this.userService.checkToken();
      this.isLoggedIn$ = this.userService.isLoggedIn();
      this.currentUser = this.userService.getCurrentUser(); 
      if(this.currentUser?.RoleId == 1){
        this.userService.updateKlijentState(true);
        this.userService.updateAdminState(false);
        this.isAdmin$ = this.userService.isAdmin();
      }
      else if(this.currentUser?.RoleId == 3){
        this.userService.updateAdminState(true);
        this.isAdmin$ = this.userService.isAdmin();
      }
      else{
        this.userService.updateKlijentState(false);
      }
    }
    else{
      this.isLoggedIn$ = this.userService.isLoggedIn();
      this.userService.updateLoggedInState(false);
      this.userService.updateKlijentState(false);
      this.userService.updateAdminState(false);
      this.currentUser = null;
    }   
  }

    ngOnInit(): void {
      
      this.userService.checkToken();
      this.isLoggedIn$ = this.userService.isLoggedIn();
      this.currentUser = this.userService.getDecodedToken();
      if(this.currentUser != null){
        //this.userService.updateLoggedInState(true);
        if(this.currentUser.RoleId == 1){
          this.sidebarService.setOpenCreateParking(false);
          this.sidebarService.setOpenStatistics(false);
          this.userService.updateAdminState(false);
        }
      }
      this.openCreateParking = this.sidebarService.openCreateParking$;
      this.openStatistics = this.sidebarService.openStatistics$;
      this.openReservation = this.sidebarService.openReservation$;
      this.openFindParking = this.sidebarService.openFindParking$;

      this.userService.reservations$.subscribe((data) => {
        this.loaded = false;
        if(data.length != 0){
        this.reservations = data.sort((a: any, b: any) => new Date(a.reservationDate).getTime() - new Date(b.reservationDate).getTime());;
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
        this.loaded = true;
      }
      })
      
      this.userService.getAllReservationsForUser(this.currentUser!.UserId).subscribe((data) => {
      
        this.reservations = data.sort((a: any, b: any) => new Date(a.reservationDate).getTime() - new Date(b.reservationDate).getTime());
        this.parkingService.getAllParkings().subscribe((data1) => {
          this.parking = data1;
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
          this.loaded = true;
        })
      })
    
    }

    odaberiPlacanje(opcija:string):void {
        const prva = document.getElementById("prva");
        const druga = document.getElementById("druga");
        if(prva?.id == opcija) {
            if(prva.className == "opcija prva" && druga?.className == "opcija druga") {
                prva.classList.toggle("aktivna");
            } else if(prva.className == "opcija prva" && druga?.className == "opcija druga aktivna"){
                prva.classList.toggle("aktivna");
                druga?.classList.toggle("aktivna");
            }
            this.placanje = 1;
        } else if(druga?.id == opcija)  {
            if(prva?.className == "opcija prva" && druga?.className == "opcija druga") {
                druga.classList.toggle("aktivna");
            } else if(druga.className == "opcija druga" && prva?.className == "opcija prva aktivna") {
                prva?.classList.toggle("aktivna");
                druga?.classList.toggle("aktivna");
            }
            this.placanje = 2;
        }
    }

    
}
