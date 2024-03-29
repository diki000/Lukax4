import { Component, OnDestroy } from '@angular/core';
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

  private allParkingSpaces: any[] = [];

  allParkings: L.FeatureGroup = new L.FeatureGroup();
  availableParkings: L.FeatureGroup = new L.FeatureGroup();

  reservations: any;

  allParkingData: any;
  secondStep2: boolean = false;
  secondStep1: boolean = false;
  step3: boolean = false;
  showPopup: boolean = false;
  final: boolean = false;
  chosenWay = 1;
  selectedParkingSpace: number = 0;
  selectedParkingSpaceManager: number = 0;

  showLoading: boolean = false;
  selectedTime: string = '';
  days: number[] = [0, 1, 2, 3, 4, 5, 6];
  disabledTimeRanges: string[] = ['08:00', '12:30', '15:45'];

  payUp: number = 0;
  payUpTotal: number = 0;
  selectedPaymentMethod: string = 'wallet';
  ponavljanje: string = 'da';

  user: any;

  startDate1: Date | undefined;
  endDate1: Date | undefined;
  startDate2: Date | undefined;
  endDate2: Date | undefined;
  currentDate = new Date();

  constructor(private parkingService: ParkingService, private userService: UserService) {
    let token = localStorage.getItem('jwt');
    if(token != undefined){
      this.userService.checkToken();
    }

   }

  private initMap(): void {
    this.map = L.map('map1', {
      center: this.centroid,
      zoom: 17
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 22,
      minZoom: 12
    });
    // var otherParkings : L.FeatureGroup = new L.FeatureGroup();
    this.showLoading = true;
    this.parkingService.getAllParkings().subscribe((parkings) => {
      this.allParkingData = parkings;

      parkings.forEach((parking: any) => {
        parking.parkingSpaces.forEach((spot: any) => {
          var points: L.LatLngExpression[] = [];
          if (spot.reservationPossible == 1) {
            this.allParkingSpaces.push(spot);

            spot.points.forEach((point: any) => {
              points.push([point.latitude, point.longitude]);
            });
            var polygon = L.polygon(points);

            polygon.on('click', (e: L.LeafletMouseEvent) => {
              if (this.selectedParkingSpaces.includes(spot)) {
                this.selectedParkingSpaceManager = spot.parkingManagerId;
                this.selectedParkingSpaces.splice(this.selectedParkingSpaces.indexOf(spot), 1);
                polygon.setStyle({ color: 'yellow' });
              } else {
                
                this.selectedParkingSpaces.push(spot);
                polygon.setStyle({ color: 'red' });
              }
            });
            polygon.setStyle({ color: 'yellow' });
            polygon.addTo(this.allParkings);
          }
        });
      });
      this.showLoading = false;
      this.allParkings.addTo(this.map);
      tiles.addTo(this.map);
    });
  }

  ngOnInit(): void {
    this.user = this.userService.currentUser
    // if(document.getElementById("map")){
    //   document.getElementById("map")?.remove();
    //   document.getElementById('map-frame')!.innerHTML = "<div id='map'></div>";

    // }
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
    if(this.startDate2 == undefined || this.endDate2 == undefined){
      alert("Niste odabrali vrijeme");
    } else {
      this.chosenWay = 2
      this.startDate1 = undefined;
      this.endDate1 = undefined;
      this.secondStep1 = false
      this.secondStep2 = true;
      this.showPopup = false;
      this.userService.getAllFreePlacesForGivenTime(this.startDate2!, this.endDate2!).subscribe((parkingsSpaces: any) => {
        parkingsSpaces.forEach((parkingSpace: any) => {
          var spot = this.allParkingSpaces.find((item) => item.parkingSpaceId == parkingSpace)
          var points: L.LatLngExpression[] = [];
          spot.points.forEach((point: any) => {
            points.push([point.latitude, point.longitude]);
          });
          var polygon = L.polygon(points);
          polygon.setStyle({ color: 'green' });
  
          polygon.on('click', (e: L.LeafletMouseEvent) => {
            polygon.setStyle({ color: 'blue' });
            this.selectedParkingSpace = spot.parkingSpaceId;
            this.selectedParkingSpaceManager = spot.parkingManagerId;
            this.findPrice();
            this.lastStep();
          });
  
          polygon.addTo(this.availableParkings);
        });
  
      }
      );
  
      this.availableParkings.addTo(this.map);

    }

  }

  stepBack(numb: number) {
    if (numb == 2) {
      this.secondStep2 = false;
      this.map.removeLayer(this.availableParkings);
      this.allParkings.addTo(this.map);
    } else if (numb == 1) {
      this.secondStep1 = false;
    }

  }


  showAvailableTimes() {
    if (this.selectedParkingSpaces.length == 0) {
      alert("Niste odabrali niti jedno mjesto");
    } else {
      this.chosenWay = 1
      this.startDate2 = undefined;
      this.endDate2 = undefined;
      this.secondStep1 = true;
      var array = this.selectedParkingSpaces.map((item: any) => item.parkingSpaceId);
      this.userService.getAllReservationsForChosenPlaces(array).subscribe((reservations) => {
        this.reservations = reservations.reduce((acc: any, currentValue: any) => {
          const existingGroup = acc.find((item: any) => item.space === currentValue.item1);

          if (existingGroup) {
            if(new Date(currentValue.item3) > this.currentDate){
              existingGroup.reservedDates.push({ item2: new Date(currentValue.item2), item3: new Date(currentValue.item3) });
              existingGroup.reservedDates.sort((a: any, b: any) => a.item2 - b.item2);
            }
          } else {
            if(new Date(currentValue.item3) > this.currentDate){ 
              acc.push({
                space: currentValue.item1,
                reservedDates: [{ item2: new Date(currentValue.item2), item3: new Date(currentValue.item3) }]
              });
            }
          }

          return acc;
        }, []);

        this.showPopup = true;
      });
    }
  }

  togglePopup() {
    this.showPopup = !this.showPopup;
  }

  lastStep() {
    this.step3 = !this.step3;
  }

  finilize() {
    let startFinal = this.startDate1 ? this.startDate1 : this.startDate2;
    let endFinal = this.endDate1 ? this.endDate1 : this.endDate2;
    let r = this.ponavljanje.toLocaleLowerCase() == 'da' ? true : false;
    let p = this.selectedPaymentMethod.toLocaleLowerCase() == 'wallet' ? true : false;
    
    // if(this.selectedPaymentMethod == 'wallet') {

    //   if(this.userService.balance < this.payUpTotal) {
    //     alert("Nemate dovoljno novaca na računu");
    //     return;
    //   } else {
    //     this.userService.payForReservation(this.userService.currentUser.UserId, this.payUpTotal).subscribe((data) => {
    //       alert("Uspješno ste platili rezervaciju");

    //       this.userService.getTransactions(this.userService.currentUser.UserId).subscribe((data) => {
    //         this.userService.updateTransactions(data);
    //       });
          
    //       this.userService.getBalance(this.userService.currentUser.UserId).subscribe((data) => {
    //         this.userService.updateBalance(data);
    //       });
    //       this.final = true;
    //     });

    //     this.userService.makeReservation(this.userService.currentUser.UserId, this.selectedParkingSpace, startFinal!, endFinal!, r, p, this.selectedParkingSpaceManager).subscribe((data) => {});  
    //   }
    // } else {
    //   this.userService.makeReservation(this.userService.currentUser.UserId, this.selectedParkingSpace, startFinal!, endFinal!, r, p, this.selectedParkingSpaceManager).subscribe((data) => {
    //     this.final = true;
    //   });
    // }

    this.userService.makeReservation(this.userService.currentUser.UserId, this.selectedParkingSpace, startFinal!, endFinal!, r, p, this.selectedParkingSpaceManager).subscribe((data) => {
      alert("Uspješno ste platili rezervaciju");

      this.userService.getTransactions(this.userService.currentUser.UserId).subscribe((data) => {
        this.userService.updateTransactions(data);
      });
      
      this.userService.getBalance(this.userService.currentUser.UserId).subscribe((data) => {
        this.userService.updateBalance(data);
      });

      this.userService.getAllReservationsForUser(this.userService.currentUser.UserId).subscribe((data) => {
        this.userService.updateReservations(data);
      });
      this.final = true;
    },
    (error) => {
      alert("Nemate dovoljno novaca na računu");
    });

  }

  fistWayFini() {
    var reservedSpot = 0;
    let startFinal = this.startDate1 ? this.startDate1 : this.startDate2;
    let endFinal = this.endDate1 ? this.endDate1 : this.endDate2;
    for (let i = 0; i < this.reservations.length; i++) {
      let av = false;
      for (let j = 0; j < this.reservations[i].reservedDates.length; j++) {
        let date2 = new Date(this.reservations[i].reservedDates[j].item2);
        let date3 = new Date(this.reservations[i].reservedDates[j].item3);

        if ((startFinal! >= date2 && startFinal! <= date3) || (endFinal! <= date3 && endFinal! >= date2) || (startFinal! <= date2 && endFinal! >= date3)) {
          av = false;
          break;
        } else {
          av = true;
        }
      }

      if (av) {
        reservedSpot = this.reservations[i].space;
        break;
      }
    }

    if (this.reservations.length == 0) {
      var array = this.selectedParkingSpaces.map((item: any) => item.parkingSpaceId);
      reservedSpot = array[0];
    }

    if (reservedSpot == 0) {
      alert("Nema slobodnih mjesta");
    } else {
      this.showPopup = false;
      this.step3 = true;
      this.selectedParkingSpace = reservedSpot;
    }

    this.findPrice();

  }

  findPrice() {
    let startFinal = this.startDate1 ? this.startDate1 : this.startDate2;
    let endFinal = this.endDate1 ? this.endDate1 : this.endDate2;
    for (let i = 0; i < this.allParkingData.length; i++) {
      for (let j = 0; j < this.allParkingData[i].parkingSpaces.length; j++) {
        if (this.allParkingData[i].parkingSpaces[j].parkingSpaceId == this.selectedParkingSpace) {
          this.payUp = this.allParkingData[i].pricePerHour;

          var totalHours = Math.abs(startFinal!.getTime() - endFinal!.getTime()) / 36e5;
          this.payUpTotal = this.payUp * totalHours;
        }
      }
    }
  }

}
