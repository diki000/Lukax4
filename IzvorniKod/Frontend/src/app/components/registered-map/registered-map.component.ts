import { Component, OnInit, Input, ViewChild, Output,EventEmitter  } from '@angular/core';
import * as L from 'leaflet';
import { ParkingService } from 'src/app/services/parking.service';
import { Map, LatLng, LatLngExpression, Control, DomUtil, DomEvent } from 'leaflet';
import { tileLayer, marker } from 'leaflet';
import 'leaflet-draw';
import '@geoapify/leaflet-address-search-plugin';
import { HttpClient } from '@angular/common/http';
import { DashboardComponent } from '../dashboard/dashboard.component';


@Component({
  selector: 'app-registered-map',
  templateUrl: './registered-map.component.html',
  styleUrls: ['./registered-map.component.scss']
})
export class RegisteredMapComponent implements OnInit{
    @Output() childEvent: EventEmitter<any> = new EventEmitter<any>();
    private map!: L.Map;
    private centroid: L.LatLngExpression = [45.79704, 15.85911]; 
    constructor(private parkingService: ParkingService, private http: HttpClient) { }
    private markerStart!:L.Marker | undefined;
    private markerEnd!:L.Marker | undefined;
    private route!: L.Polyline;
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
          var points: L.LatLngExpression[] = [];
          parking.parkingSpaces.forEach((spot: any) => {
            spot.points.forEach((point: any) => {
              points.push([point.latitude, point.longitude]);
            });
            var polygon = L.polygon(points);
            polygon.setStyle({ color: 'red' });
            polygon.addTo(otherParkings);
          });
        });
        otherParkings.addTo(this.map);
      tiles.addTo(this.map);
    });

    
    let myIconStart = L.icon({iconUrl:"../../../assets/home.png", iconSize: [32,32], iconAnchor:[16,32]});
    let iconOptionsStart = {
        title:"company name",
        draggable:false,
        icon:myIconStart
    }

    let myIconEnd = L.icon({iconUrl:"../../../assets/destinations.png", iconSize: [32,32], iconAnchor:[7,31]});
    let iconOptionsEnd = {
        title:"company name",
        draggable:false,
        icon:myIconEnd
    }

    this.parkingService.waypointsready$.subscribe((data) => {
        this.parkingService.getQuickestPath(this.parkingService.lat1, this.parkingService.lng1, this.parkingService.lat2,this.parkingService.lng2).subscribe((data) => {
            if(this.route !== undefined) this.map.removeLayer(this.route);
            let points = []
            for(const step of data.routes[0].legs[0].steps) {
                for(const intersection of step.intersections) {
                    let point = L.latLng(intersection.location[1], intersection.location[0]);
                    points.push(point);
                }
            }
            this.route = L.polyline(points, { color: "blue" }).addTo(this.map);
        })
      })

    this.map.on('click', (event)=>{
        const lat = event.latlng.lat.toString();
        const lng = event.latlng.lng.toString();
        const url = "https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=" + lat + "&lon=" + lng;

        if(this.markerStart !== undefined && this.markerEnd !== undefined) {
            this.map.removeLayer(this.markerStart);
            this.map.removeLayer(this.markerEnd);
            if(this.route !== undefined) this.map.removeLayer(this.route);
            this.markerStart = L.marker([event.latlng.lat, event.latlng.lng], iconOptionsStart).addTo(this.map);;
            this.markerEnd = undefined;
            this.http.get(url).subscribe(
                (data:any) => {
                        this.childEvent.emit([data.address.road, data.address.house_number, data.address.city, data.address.country, "start", "1", lat, lng]);
                }
            );
        } else if(this.markerStart == undefined && this.markerEnd == undefined){
            this.markerStart = L.marker([event.latlng.lat, event.latlng.lng], iconOptionsStart).addTo(this.map);
            this.http.get(url).subscribe(
                (data:any) => {
                        this.childEvent.emit([data.address.road, data.address.house_number, data.address.city, data.address.country, "start", "0", lat, lng]);
                }
            );
        } else if(this.markerStart !== undefined && this.markerEnd == undefined) {
            this.markerEnd = L.marker([event.latlng.lat, event.latlng.lng], iconOptionsEnd).addTo(this.map);
            this.http.get(url).subscribe(
                (data:any) => {
                        this.childEvent.emit([data.address.road, data.address.house_number, data.address.city, data.address.country, "end", "0", lat, lng]);
                }
            );
        }
    })
}
  
    ngOnInit(): void {
      this.initMap();
      
    }

}
