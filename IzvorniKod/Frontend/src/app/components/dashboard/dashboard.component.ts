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
  isLoggedIn$ : Observable<boolean> | undefined;
  openCreateParking: Observable<boolean> = new Observable<false>;
  openStatistics: Observable<boolean> = new Observable<false>;
  openReserve: Observable<boolean> = new Observable<false>;
  placanje : number = 1;
  pocetak : string = "";
  kraj : string = "";
  
  
  
  createReserveForm: FormGroup = new FormGroup({});
  
  //@ViewChild('childComponentRef', { static: false }) childComponent! : RegisteredMapComponent;

  constructor(private userService: UserService, private sidebarService: SidebarService, private parkingservice:ParkingService) {
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
      this.openReserve = this.sidebarService.openReserve$;
      
      this.createReserveForm = new FormGroup({
        Duration: new FormControl('', [Validators.required]),
        StartDest: new FormControl('', [Validators.required]),
        EndDest: new FormControl('', [Validators.required]),
        Payement: new FormControl('', [Validators.required])
    });
    
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

    rezerviraj():void {
        //console.log(this.userService.getCurrentUserId());
        //console.log(this.createReserveForm.value.Duration);

        this.createReserveForm.value.StartDest = this.pocetak;
        this.createReserveForm.value.EndDest = this.kraj;
        //console.log(this.createReserveForm.value.StartDest);
        //console.log(this.createReserveForm.value.EndDest);

        this.createReserveForm.value.Payement = this.placanje;
        //console.log(this.createReserveForm.value.Payement);

        let poljePocetak = this.pocetak.split(" ")
        let poljeKraj = this.kraj.split(" ")
        this.parkingservice.lat1 = parseFloat(poljePocetak[0])
        this.parkingservice.lng1 = parseFloat(poljePocetak[1])

        this.parkingservice.lat2 = parseFloat(poljeKraj[0])
        this.parkingservice.lng2 = parseFloat(poljeKraj[1])

        this.parkingservice.setwaypointsReady(true);
    }

    

    finalAddress(data:string[]):void{
       let adresa = "";
       if(data[0] !== undefined) adresa = adresa + data[0] + " ";
       if(data[1] !== undefined) adresa = adresa + data[1] + ", ";
       if(data[2] !== undefined) adresa = adresa + data[2] + ", ";
       if(data[3] !== undefined) adresa = adresa + data[3];
       console.log("Konacna adresa je " + adresa);

       (<HTMLInputElement>document.getElementById(data[4])).value = adresa;
       if(data[5] == "1") {
        (<HTMLInputElement>document.getElementById("end")).value = "";
       }
       
       if(data[4] == "start") this.pocetak = data[6] + " " + data[7];
       if(data[4] == "end") this.kraj = data[6] + " " + data[7];
    }
    

    



 

}
