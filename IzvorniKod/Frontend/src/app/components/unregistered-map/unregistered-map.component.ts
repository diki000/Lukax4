import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { ParkingService } from 'src/app/services/parking.service';

@Component({
  selector: 'app-unregistered-map',
  templateUrl: './unregistered-map.component.html',
  styleUrls: ['./unregistered-map.component.scss']
})
export class UnregisteredMapComponent implements OnInit{
  private map!: L.Map;
  private centroid: L.LatLngExpression = [45.79704, 15.85911]; //

  constructor(private parkingService: ParkingService) { }

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
    var otherParkings : L.FeatureGroup = new L.FeatureGroup();
    this.parkingService.getAllParkings().subscribe((parkings) => {
      parkings.forEach((parking : any) => {
        parking.parkingSpaces.forEach((spot: any) => {
          var points: L.LatLngExpression[] = [];
          spot.points.forEach((point: any) => {
            points.push([point.latitude, point.longitude]);
          });
          var polygon = L.polygon(points);
          polygon.setStyle({ color: 'yellow' });
          polygon.addTo(otherParkings);
        });
      });
      otherParkings.addTo(this.map);
    tiles.addTo(this.map);
  });}

  ngOnInit(): void {
    this.initMap();

  }

}
