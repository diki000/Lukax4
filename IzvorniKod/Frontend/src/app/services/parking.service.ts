import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Parking } from '../models/Parking';

@Injectable({
  providedIn: 'root'
})
export class ParkingService {
  url: string = "https://localhost:7020/api/Parking";
  private waypointsReady: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(private http: HttpClient) { }
  lat1:number = 0;
  lng1:number = 0;
  lat2:number = 0;
  lng2:number = 0;

  public addNewParking(parking: Parking): Observable<any>{
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    let body = JSON.stringify(parking);
    return this.http.post<any>(this.url + "/AddNewParking", body, httpOptions);
  }
  public getAllParkings(): Observable<Parking[]>{
    return this.http.get<Parking[]>(this.url + "/GetAllParkings");
  }
  public deleteParking(id: number): Observable<any>{
    return this.http.get<any>(this.url + "/DeleteParking?parkingId=" + id);
  }
  public getParkingStatistics(ownerId: number) : Observable<any[]>{
    return this.http.get<any[]>(this.url + "/GetParkingStatistics?ownerId=" + ownerId);
  }

  public getQuickestPath(lat1:number, lng1:number, lat2:number, lng2: number): Observable<any>{
    return this.http.get<any>("http://router.project-osrm.org/route/v1/driving/" + lng1 + "," + lat1 + ";" + lng2 + "," + lat2 + "?overview=false&steps=true");
  }

  get waypointsready$() {
    return this.waypointsReady.asObservable();
  }
  setwaypointsReady(value: boolean) {
    this.waypointsReady.next(value);
  }
}
