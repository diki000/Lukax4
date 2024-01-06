import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Parking } from 'src/app/models/Parking';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-owner',
  templateUrl: './owner.component.html',
  styleUrls: ['./owner.component.scss']
})
export class OwnerComponent {

    constructor(private userservice:UserService){}

    otvoriParking : boolean = false;
    otvorStatistika : boolean = false;

    createParkingForm: FormGroup = new FormGroup({});

    parkingData = {
        AccessToken:'',
        ParkingName:'',
        Price:0,
        Description:''
    };

    onSubmit():void {
        let newParking = new Parking(
            this.userservice.currentUser.AccessToken,
            this.parkingData.ParkingName, 
            this.parkingData.Price, 
            this.parkingData.Description);
    }

    smanji():void {
        const body = document.querySelector("body");
        const sidebar = body?.querySelector(".sidebar");
        sidebar?.classList.toggle("close");
    }

    otvoriStvoriParking():void {
        this.otvoriParking = true;
        this.otvorStatistika = false;
    }

    otvoriStatistika():void {
        this.otvorStatistika = true;
        this.otvoriParking = false;
    }
}
