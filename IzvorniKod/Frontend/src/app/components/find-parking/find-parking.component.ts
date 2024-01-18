import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from 'src/app/models/User';
import { ParkingService } from 'src/app/services/parking.service';
import { SidebarService } from 'src/app/services/sidebar.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-find-parking',
  templateUrl: './find-parking.component.html',
  styleUrls: ['./find-parking.component.scss']
})
export class FindParkingComponent implements OnInit{

  currentUser : User | null = null;
  createReserveForm: FormGroup = new FormGroup({});
  placanje : number = 1;
  pocetak : string = "";
  kraj : string = "";
  reservations: any[] = [];
  parking : any[] = [];
  loaded = false;  

  constructor(private parkingService: ParkingService, private userService: UserService, private sidebarService: SidebarService) { }

  ngOnInit(): void {
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
    if(this.placanje == 1){
      this.parkingService.paymentType = 1;
    }
    else{
      this.parkingService.paymentType = 2;
    }
  }
  rezerviraj():void {
    console.log("rezerviraj")
    this.createReserveForm.value.StartDest = this.pocetak;
    this.createReserveForm.value.EndDest = this.kraj;
    this.createReserveForm.value.Payement = this.placanje;
    let poljePocetak = this.pocetak.split(" ")
    let poljeKraj = this.kraj.split(" ")
    this.parkingService.lat1 = parseFloat(poljePocetak[0])
    this.parkingService.lng1 = parseFloat(poljePocetak[1])

    this.parkingService.lat2 = parseFloat(poljeKraj[0])
    this.parkingService.lng2 = parseFloat(poljeKraj[1])
    this.parkingService.duration = this.createReserveForm.value.Duration;
    if(this.createReserveForm.value.StartDest == "" || this.createReserveForm.value.EndDest == "" || this.createReserveForm.value.Duration == "" || this.createReserveForm.value.Payement == "")
      this.parkingService.setwaypointsReady(false);
    else
      this.parkingService.setwaypointsReady(true);
  }

  findParking(id: number) {
    return this.parking.find((x) => x.ParkingId == id);
  }

  finalAddress(data:string[]):void{
   let adresa = "";
   if(data[0] !== undefined) adresa = adresa + data[0] + " ";
   if(data[1] !== undefined) adresa = adresa + data[1] + ", ";
   if(data[2] !== undefined) adresa = adresa + data[2] + ", ";
   if(data[3] !== undefined) adresa = adresa + data[3];

   (<HTMLInputElement>document.getElementById(data[4])).value = adresa;
   if(data[5] == "1") {
    (<HTMLInputElement>document.getElementById("end")).value = "";
   }
   
   if(data[4] == "start") this.pocetak = data[6] + " " + data[7];
   if(data[4] == "end") this.kraj = data[6] + " " + data[7];
  }
}
