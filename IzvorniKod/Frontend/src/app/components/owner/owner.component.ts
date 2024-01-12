import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Parking } from 'src/app/models/Parking';
import { ParkingSpace } from 'src/app/models/ParkingSpot';
import { ParkingService } from 'src/app/services/parking.service';
import { SidebarService } from 'src/app/services/sidebar.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-owner',
  templateUrl: './owner.component.html',
  styleUrls: ['./owner.component.scss']
})
export class OwnerComponent implements OnInit{

    constructor(private userservice:UserService, private _elementRef : ElementRef, private parkingService: ParkingService, private sidebarService: SidebarService){}

    otvoriParking : boolean = false;
    otvorStatistika : boolean = false;
    otvoriMapu : boolean = false;
    parkingSpots: ParkingSpace[] = [];

    createParkingForm: FormGroup = new FormGroup({});

    parkingData = {
        ManagerId:0,
        ParkingName:'',
        Price:0,
        Description:''
    };

    ngOnInit(): void {
        this.createParkingForm = new FormGroup({
            ManagerId: new FormControl('', [Validators.required]),
            ParkingName: new FormControl('', [Validators.required]),
            Price: new FormControl('', [Validators.required]),
            Description: new FormControl('', [Validators.required]),
            File: new FormControl('', [Validators.required])
        });
    }

    onSubmit():void {
        let newParking = new Parking(
            0,
            this.createParkingForm.value.ParkingName,
            this.createParkingForm.value.Price,
            this.createParkingForm.value.Description);
        if(this.userservice.getDecodedToken() != null){
            newParking.ManagerId = this.userservice.getDecodedToken()!.UserId;
        }
        newParking.parkingSpaces = this.parkingSpots;
        this.parkingService.addNewParking(newParking).subscribe(
            response => {
                alert("Uspješno ste kreirali parking!")
                this.otvoriParking = false;
            },
            error => {
                alert("Nešto je pošlo po zlu!")
            });
    }

    smanji():void {
        const body = document.querySelector("body");
        const sidebar = body?.querySelector(".sidebar");
        sidebar?.classList.toggle("close");
    }
    closeCreateParking():void {
        this.sidebarService.setOpenCreateParking(false);
    }
    otvoriMapuParkinga(){
        this.otvoriMapu = true;
    }
    updateParkingSpots(event: ParkingSpace[]) {
        this.parkingSpots = event;
    }
    @HostListener('document:click', ['$event.target'])
    onClick(targetElement:any) {
        if(targetElement.id == "map-background"){
            this.otvoriMapu = false;        }
    }
}