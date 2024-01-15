import { Component } from '@angular/core';
import * as L from 'leaflet';
import { ParkingSpace } from 'src/app/models/ParkingSpot';
import { User } from 'src/app/models/User';
import { ParkingService } from 'src/app/services/parking.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss']
})
export class ReservationComponent {
  private map!: L.Map;
  private centroid: L.LatLngExpression = [45.79704, 15.85911]; 
  private selectedParkingSpaces: ParkingSpace[] = [];
  
  allParkings: L.FeatureGroup = new L.FeatureGroup();
  availableParkings: L.FeatureGroup = new L.FeatureGroup();

  testing : any;
  secondStep2 : boolean = false;
  secondStep1 : boolean = false;

  user : any;

  startDate: Date | undefined;
  endDate: Date | undefined;
  currentDate = new Date();

  constructor(private parkingService: ParkingService, private userService: UserService) { }

  private initMap(): void {
    this.map = L.map('map', {
      center: this.centroid,
      zoom: 17
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 22,
      minZoom: 12
    });
    // var otherParkings : L.FeatureGroup = new L.FeatureGroup();
    this.parkingService.getAllParkings().subscribe((parkings) => {
      console.log(parkings);
      this.testing = []
      this.testing.push(parkings[0].parkingSpaces[0]);
      this.testing.push(parkings[1].parkingSpaces[0]);
      parkings.forEach((parking : any) => {
        var points: L.LatLngExpression[] = [];
        parking.parkingSpaces.forEach((spot: any) => {
          spot.points.forEach((point: any) => {
            points.push([point.latitude, point.longitude]);
          });
          var polygon = L.polygon(points);
        
          polygon.on('click', (e : L.LeafletMouseEvent) => {
            if(this.selectedParkingSpaces.includes(spot)){
              this.selectedParkingSpaces.splice(this.selectedParkingSpaces.indexOf(spot), 1);
              polygon.setStyle({ color: 'yellow' });
            } else {
              this.selectedParkingSpaces.push(spot);
              polygon.setStyle({ color: 'red' });
            }
          });
          polygon.setStyle({ color: 'yellow' });
          polygon.addTo(this.allParkings);
        });
      });
      this.allParkings.addTo(this.map);
    tiles.addTo(this.map);
  });}

  ngOnInit(): void {
    this.user = this.userService.currentUser
    this.initMap();
    // this.addMapClickListener();
  }

  private addMapClickListener() {
    this.map.on('click', (e) => {
      var popup = L.popup()
      .setLatLng(e.latlng)
      .setContent('test')
      .openOn(this.map);
      this.map.openPopup(popup);
    });
  }

  showAvailableSpots() {
    this.map.removeLayer(this.allParkings);
    this.secondStep2 = true;
    this.testing.forEach((spot: any) => {
      var points: L.LatLngExpression[] = [];
      spot.points.forEach((point: any) => {
        points.push([point.latitude, point.longitude]);
      });
      var polygon = L.polygon(points);
      polygon.setStyle({ color: 'green' });

      polygon.on('click', (e : L.LeafletMouseEvent) => {
        polygon.setStyle({ color: 'blue' });
        console.log(spot)
      });

      polygon.addTo(this.availableParkings);
    }
    );
    this.availableParkings.addTo(this.map);

  }

  stepBack(numb: number) {
    if(numb == 2) {
      this.secondStep2 = false;
      this.map.removeLayer(this.availableParkings);
      this.allParkings.addTo(this.map);
    } else if(numb == 1) {
      this.secondStep1 = false;
    }

  }


  showAvailableTimes() {
    this.secondStep1 = true;
  }
}
