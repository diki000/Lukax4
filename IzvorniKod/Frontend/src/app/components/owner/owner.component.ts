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
    isOwner: boolean = false;

    fileToUpload: File[] | null = null;

    createParkingForm: FormGroup = new FormGroup({});

    parkingData = {
        ManagerId:0,
        ParkingName:'',
        Price:0,
        Description:''
    };

    ngOnInit(): void {
        this.isOwner = this.userservice.currentUser.RoleId == 2;
        this.createParkingForm = new FormGroup({
            ManagerId: new FormControl('', [Validators.required]),
            ParkingName: new FormControl('', [Validators.required]),
            Price: new FormControl('', [Validators.required]),
            Description: new FormControl('', [Validators.required]),
            File: new FormControl('', [Validators.required]),
            BikePS: new FormControl('', [Validators.required])
        });
    }

    onSubmit():void {
        let newParking = new Parking(
            0,
            0,
            this.createParkingForm.value.ParkingName,
            this.createParkingForm.value.Price,
            this.createParkingForm.value.Description,
            this.createParkingForm.value.BikePS);
        if(this.userservice.getDecodedToken() != null){
            newParking.ManagerId = this.userservice.getDecodedToken()!.UserId;
        }
        newParking.parkingSpaces = this.parkingSpots;
        const formData = new FormData();
        if (this.fileToUpload) {
            formData.append('files', this.fileToUpload[0]);
        }
        formData.append('parking', JSON.stringify(newParking));
        this.parkingService.addNewParking(formData).subscribe(
            response => {
                alert("Uspješno ste kreirali parking!")
                this.createParkingForm.reset();
                this.parkingSpots = [];
            },
            error => {
                alert("Nešto je pošlo po zlu!")
            });
    }

    onFileSelected(event: any){
        this.fileToUpload = event.target.files;
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
