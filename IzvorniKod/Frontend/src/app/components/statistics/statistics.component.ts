import { Component, OnInit } from '@angular/core';
import { Parking } from 'src/app/models/Parking';
import { ParkingService } from 'src/app/services/parking.service';
import { User } from 'src/app/models/User';
import { UserService } from 'src/app/services/user.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit{
  lastTenDates: string[] = [];
  Parkings : Parking[] = [];
  currentUser : User | null = null;
  public chart: any;
  parkingOccupancy: any[] = [];
  constructor(private parkingService: ParkingService, private userService: UserService) {
    let token = localStorage.getItem('jwt');
    if(token != undefined){
      this.userService.checkToken();
      this.currentUser = this.userService.getCurrentUser();
    }
   }

  ngOnInit(): void {
    this.parkingService.getAllParkings().subscribe((data: any[]) => {
      data.forEach((parking) => {
        if(parking.managerId == this.currentUser?.UserId){
          let occupeidSpaces = 0;
          this.Parkings.push(new Parking(parking.parkingId,parking.managerId, parking.name, parking.pricePerHour, parking.description, parking.numberOfBikePS, parking.parkingSpaces, parking.idParkingImagePath));
          this.Parkings[this.Parkings.length-1].parkingSpaces.forEach((parkingSpace) => {
            if(parkingSpace.isOccupied){
              occupeidSpaces++;
            }
          });
          this.parkingOccupancy.push(occupeidSpaces);
        }
      });
      console.log(this.Parkings);
    }
  );
  this.getLastTenDates();
  this.createChart()
}
formatDate(date: Date): string {
  const day = date.getDate();
  const month = date.getMonth() + 1; // Months are zero-based
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}
getLastTenDates() {
  const today = new Date();
  for (let i = 0; i < 10; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const formattedDate = this.formatDate(date);
    this.lastTenDates.push(formattedDate);
  }
  this.lastTenDates.reverse();
}
createChart(){
  
  this.chart = new Chart("MyChart", {
    type: 'line', //this denotes tha type of chart

    data: {// values on X-Axis
      labels: this.lastTenDates, 
       datasets: [
        {
          label: "Zarada",
          data: ['467','576', '572', '79', '92',
               '574', '573', '576', '574', '573'],
          backgroundColor: 'pink'
        },
        {
          label: "Broj rezervacija",
          data: ['542', '542', '536', '327', '17',
                 '0.00', '538', '541', '541', '541'],
          backgroundColor: '#FF00FF'
        }  
      ]
    },
    options: {
      aspectRatio:2.5
    }
    
    });
  }
  deleteParking(parkingIndex: number){
    this.parkingService.deleteParking(this.Parkings[parkingIndex].parkingId).subscribe(
      response => {
        alert("Uspješno ste obrisali parking!")
        this.Parkings.splice(parkingIndex, 1);
      },
      error => {
          alert("Nešto je pošlo po zlu!")
      });
  }
}
