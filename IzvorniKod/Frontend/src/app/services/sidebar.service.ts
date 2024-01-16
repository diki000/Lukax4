import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private openCreateParking: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private openStatistics: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private openReserve: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

 

  get openCreateParking$() {
    return this.openCreateParking.asObservable();
  }
  get openStatistics$() {
    return this.openStatistics.asObservable();
  }
  setOpenCreateParking(value: boolean) {
    this.openCreateParking.next(value);
  }
  setOpenStatistics(value: boolean) {
    this.openStatistics.next(value);
  }
  get openReserve$() {
    return this.openReserve.asObservable();
  }
  setOpenReserve(value: boolean) {
    this.openReserve.next(value);
  }


  
  constructor() { }
}
