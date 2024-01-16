import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private openCreateParking: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private openStatistics: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private openReservation: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  get openCreateParking$() {
    return this.openCreateParking.asObservable();
  }

  get openReservation$() {
    return this.openReservation.asObservable();
  }

  get openStatistics$() {
    return this.openStatistics.asObservable();
  }
  setOpenCreateParking(value: boolean) {
    this.openCreateParking.next(value);
  }

  setOpenReservation(value: boolean) {
    this.openReservation.next(value);
  }

  setOpenStatistics(value: boolean) {
    this.openStatistics.next(value);
  }
  constructor() { }
}
