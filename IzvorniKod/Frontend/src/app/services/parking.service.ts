import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Parking } from '../models/Parking';

@Injectable({
  providedIn: 'root'
})
export class ParkingService {
  //url: string = "https://localhost:7020/api/Parking";
  url: string = "https://spotpicker.online/api/Parking";
  private waypointsReady: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(private http: HttpClient) { }
  lat1:number = 0;
  lng1:number = 0;
  lat2:number = 0;
  lng2:number = 0;
  paymentType: number = 0;
  duration: number = 0;

  public addNewParking(parking: FormData): Observable<any>{
    // let httpOptions = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json',
    //   })
    // };
    // let body = JSON.stringify(parking);
    // return this.http.post<any>(this.url + "/AddNewParking", body, httpOptions);
    return this.http.post<any>(this.url + "/AddNewParking", parking);
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
    return this.http.get<any>("https://router.project-osrm.org/route/v1/driving/" + lng1 + "," + lat1 + ";" + lng2 + "," + lat2 + "?overview=false&steps=true");
  }
  public getNearestParkingSpace(userId: number, startLongitude: number, startLatitude: number,endLongitude : number, endLatitude: number, profile: number, duration: number, paymentType: number ){
    return this.http.get<any>(this.url + "/GetNearestParkingSpaceCoordinates?userId=" + userId + "&startLongitude=" + startLongitude + "&startLatitude=" + startLatitude + "&endLongitude=" + endLongitude + "&endLatitude=" + endLatitude + "&profile=" + profile + "&duration=" + duration + "&paymentType=" + paymentType);
  }
  get waypointsready$() {
    return this.waypointsReady.asObservable();
  }
  setwaypointsReady(value: boolean) {
    this.waypointsReady.next(value);
  }
}
