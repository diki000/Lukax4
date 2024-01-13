import { makeBindingParser } from '@angular/compiler';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as L from 'leaflet';
import { Map, LatLng, LatLngExpression, Control, DomUtil, DomEvent } from 'leaflet';
import { tileLayer, marker } from 'leaflet';
import 'leaflet-draw';
import { Point } from 'src/app/models/MapPoint';
import { ParkingSpace } from 'src/app/models/ParkingSpot';
import { ParkingService } from 'src/app/services/parking.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  @Input() parkingName: string = 'neimenovani parking';
  @Input() parkingSpots: ParkingSpace[] = [];
  @Output() parkingSpotsChange = new EventEmitter<ParkingSpace[]>();
  
  private map!: L.Map;
  private drawnItems: L.FeatureGroup = new L.FeatureGroup() ;
  sensorModeEnabled = false;
  private centroid: L.LatLngExpression = [45.79704, 15.85911];

  private initMap(): void {
    this.map = L.map('map', {
      center: this.centroid,
      zoom: 16
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 22,
      minZoom: 2,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    tiles.addTo(this.map);
    this.addDrawingControl();
  }

  constructor(private parkingService: ParkingService, private userService: UserService) { }

  ngOnInit(): void {
    this.initMap();
    L.control.scale().addTo(this.map);  
    this.addMapClickListener();
  }

  private addDrawingControl() {
    this.map.addLayer(this.drawnItems);
    this.parkingSpots.forEach((spot: ParkingSpace) => {
      var points: LatLngExpression[] = [];
      spot.points.forEach((point: Point) => {
        points.push([point.Latitude, point.Longitude]);
      });
      var polygon = L.polygon(points);
      if(spot.hasSensor){
        polygon.setStyle({ color: 'green' });
      }
      else{
        polygon.setStyle({ color: 'yellow' });
      }
      polygon.addTo(this.drawnItems);
    });
    const options = {
      edit: {
        featureGroup: this.drawnItems,
        edit: false,

        poly: {
          allowIntersection: false,
        },
      },
      draw: {
        polygon: true,
        marker: false,
        circlemarker: false,
        circle: false,
        polyline: false,
        rectangle: false,
      },
    };

    const drawControl = new (L.Control as any).Draw(options);
    
    this.map.addControl(drawControl);

    this.map.on((L as any).Draw.Event.CREATED, (event: any) => {
      const layer = event.layer;
      layer.setStyle({ color: 'yellow' });
      this.drawnItems.addLayer(layer);
      var points: Point[] | undefined = [];
      var markedSpots = layer.getLatLngs();
      for(var i = 0; i < markedSpots[0].length; i++){
        points!.push(new Point(markedSpots[0][i].lat, markedSpots[0][i].lng, 0));
      }
      var newSpot = new ParkingSpace(0, 1, 0,0, points);
      this.parkingSpots.push(newSpot);
      this.parkingSpotsChange.emit(this.parkingSpots);
    });

    this.map.on((L as any).Draw.Event.DELETED, (event: any) => {
      const layers = event.layers;
      layers.eachLayer((layer: any) => {
        var points: Point[] | undefined = [];
        layer.getLatLngs().forEach((point: any) => {
          point.forEach((point: any) => {
            points!.push(new Point(point.lat, point.lng, 0));
          }
          );
        });
        var newSpot = new ParkingSpace(0, 1, 0, 0, points);
        this.parkingSpots = this.parkingSpots.filter((spot: ParkingSpace) => !spot.equals(newSpot));
        this.parkingSpotsChange.emit(this.parkingSpots);
      });
    });
    var otherParkings : L.FeatureGroup = new L.FeatureGroup();
    var myOldParkings : L.FeatureGroup = new L.FeatureGroup();
    this.parkingService.getAllParkings().subscribe((parkings) => {
      let userId = this.userService.getDecodedToken()?.UserId;
      parkings.forEach((parking : any) => {
        var points: LatLngExpression[] = [];
        parking.parkingSpaces.forEach((spot: any) => {
          spot.points.forEach((point: any) => {
            points.push([point.latitude, point.longitude]);
          });
          var polygon = L.polygon(points);
          if(spot.hasSensor){
            polygon.setStyle({ color: 'green' });
          }
          else{
            polygon.setStyle({ color: 'yellow' });
          }
          if(parking.managerId == userId){
            polygon.addTo(myOldParkings);
          }
          else{
            polygon.addTo(otherParkings);
          }
        });

      });
    });
    var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 22,
      minZoom: 2,
      attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
    });
    tiles.addTo(this.map);
    var overlayMaps = {
      'Ostala parkirališta': otherParkings,
      'Moja parkirališta' : myOldParkings,
      'Novo parkiralište': this.drawnItems
    };
    
    L.control.layers(overlayMaps).addTo(this.map);
  }
  private addMapClickListener() {
    this.map.on('click', (event) => {
      // Check if sensor mode is enabled
      if (this.sensorModeEnabled) {
        // Iterate over drawn items and set parkingSensor property for clicked point
        this.drawnItems.eachLayer((layer: L.Layer) => {
          if (layer instanceof L.Polygon && layer.getBounds().contains(event.latlng)) {
            (layer as CustomPolygon).parkingSensor = !(layer as CustomPolygon).parkingSensor;
            var points: Point[] | undefined = [];
            layer.getLatLngs().forEach((point: any) => {
              point.forEach((point: any) => {
                points!.push(new Point(point.lat, point.lng, 0));
              }
              );
            });
            let selectedParkingSpot = new ParkingSpace(0, 0, 0, 0, points);
            if(layer.options.color == 'green'){
              let selectedParkingSpot = new ParkingSpace(0, 0, 0, 0, points);
              layer.setStyle({ color: 'yellow' });
            }
            else{
              let selectedParkingSpot = new ParkingSpace(0, 0, 1, 0, points);
              layer.setStyle({ color: 'green' });
            }
            this.parkingSpots.forEach((spot: ParkingSpace) => {
              if(spot.equals(selectedParkingSpot)){
                spot.hasSensor = 1 - spot.hasSensor;
              }
            });
            this.parkingSpotsChange.emit(this.parkingSpots);
            
          }
        });
      }
    });
  }
  enableSensorMode() {
    this.sensorModeEnabled = !this.sensorModeEnabled;
  }
}
interface CustomPolygon extends L.Polygon {
  parkingSensor?: boolean;
  ownerId?: number;
  occupied?: boolean;
}

