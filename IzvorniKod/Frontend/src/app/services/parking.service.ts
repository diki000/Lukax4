import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Parking } from '../models/Parking';

@Injectable({
  providedIn: 'root'
})
export class ParkingService {
  url: string = "https://localhost:7020/api/Parking";

  constructor(private http: HttpClient) { }

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
}
