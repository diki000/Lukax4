import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/User';
import { BehaviorSubject, Observable } from 'rxjs';
import { Wallet } from '../models/Wallet';
import { Transaction } from '../models/Transaction';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url: string = "https://localhost:7020/api/User";
  currentUser: User = new User(0,"","","","","","",false,0,"");
  private decodedPayload:any = 1;
  checkToken() {
    if(localStorage.getItem('jwt') != undefined) {
        let token = localStorage.getItem('jwt');
        const payload = token!.split('.')[1];
        const decodedToken = window.atob(payload);
        this.decodedPayload = JSON.parse(decodedToken);
        let user = new User(this.decodedPayload.UserId, this.decodedPayload.Username, "", this.decodedPayload.Name, this.decodedPayload.Surname, "", this.decodedPayload.Email, false, this.decodedPayload.RoleID, token!);
        this.updateLoggedInState(true);
        if(this.decodedPayload.RoleID == 3) this.updateAdminState(true);
        this.setCurrentUser(user);
    } else {
        this.updateLoggedInState(false);
        this.updateAdminState(false)
    }
  }
  public getDecodedToken(){
    if(this.decodedPayload != 1) {
      let user = new User(this.decodedPayload.UserId, this.decodedPayload.Username, "", this.decodedPayload.Name, this.decodedPayload.Surname, "", this.decodedPayload.Email, false, this.decodedPayload.RoleID, "");
      return user;
    }
    return null;
  }
  
  
  
  private authSubject : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(localStorage.getItem('jwt') != null);
  private adminSubject : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.getDecodedToken()?.RoleId == 3);
  private klijentSubject : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.getDecodedToken()?.RoleId == 1);

  isLoggedIn$ = this.authSubject.asObservable();
  isAdmin$ = this.authSubject.asObservable();
  isKlijent$ = this.authSubject.asObservable();
  moneyToTransfer: number = 0;
  balance: number = 0;

  updateLoggedInState(status: boolean){
      this.authSubject.next(status);
  }
  updateAdminState(status: boolean){
    this.adminSubject.next(status);
  }
  updateKlijentState(status: boolean){
    this.klijentSubject.next(status);
  }

  constructor(private http: HttpClient) { }

  public register(user: User): Observable<User>{
    return this.http.post<User>(this.url + "/Register", user);
  }

  public postImage(data: FormData): Observable<any> {
    return this.http.post<any>(this.url + '/UploadImage', data);
  }

  public login(username: string, password: string){
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    };
    let body = JSON.stringify({username, password});
    return this.http.post(this.url + "/Login", body, httpOptions);
  }

  public getRecoveryEmail(email: string): Observable<number>{

    return this.http.get<number>(this.url + "/GetRecoveryEmail?email=" + email);
  }

  public changePassword(email: string, password: string): Observable<User>{
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    };
    let body = JSON.stringify({email, password});
    return this.http.post<User>(this.url + "/ChangePassword", body, httpOptions);
  }


  public setCurrentUser(user: any){
    this.currentUser = new User(user.UserId, user.Username, user.Password, user.Name, user.Surname, user.IBAN, user.Email, user.isEmailConfirmed, user.RoleId, user.idImagePath);
    this.authSubject.next(true);
  }

  public getCurrentUser(): any{
    return this.currentUser;
  }

  public isLoggedIn(){
    return this.authSubject.asObservable();
  }
  public isAdmin(){
    return this.adminSubject.asObservable();
  }
  public isKlijent(){
    return this.klijentSubject.asObservable();
  }
  public logout(){
    this.currentUser = new User(0,"","","","","","",false,0,"");
    this.authSubject.next(false);
    this.adminSubject.next(false);
    if(localStorage.getItem('jwt') != null)
      localStorage.removeItem('jwt');
    }

  public getBalance(id: number): Observable<Wallet>{
    return this.http.get<Wallet>(this.url + "/GetWallet?id=" + id);
  }

  public getTransactions(id: number): Observable<Transaction[]>{
    return this.http.get<Transaction[]>(this.url + "/GetLast5Transactions?id=" + id);
  }

  public addPayment(Id: number, Amount: number): Observable<any>{
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    };
    let body = JSON.stringify({Id, Amount});
    return this.http.post<any>(this.url + "/AddPayment", body, httpOptions);
  }

    public payForReservation(Id: number, Amount: number): Observable<any>{
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
        })
      };
      let body = JSON.stringify({Id, Amount});
      return this.http.post<any>(this.url + "/payForReservation", body, httpOptions);
    }

    public getAllFreePlacesForGivenTime(start: Date, end: Date): Observable<number[]> {
      const formattedStart = start.toISOString();
      const formattedEnd = end.toISOString();

      var body = JSON.stringify({start: formattedStart, end: formattedEnd});

      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
        })
      };
      return this.http.post<number[]>(this.url + "/getAllFreePlacesForGivenTime", body, httpOptions);
    }

    public getAllReservationsForChosenPlaces(ids: number[]) {
      var query = "?"
      ids.forEach((item, index) => {
        if(index == ids.length - 1) {
          query += "numbers=" + item;
        } else {
          query += "numbers=" + item + "&";
        }
      });
      console.log(query);
      return this.http.get<any>(this.url + "/GetAllReservationsForChosenPlaces" + query);
    }

    public makeReservation(userId: number, psId:number, rDate: Date, rDuration: Date, repeat: boolean, payedWithCard: boolean, pmID: number) {
      let httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
        })
      };
      let body = JSON.stringify({userId : userId, psId : psId, rDate, rDuration, repeat, payedWithCard, pmID});
      console.log(body);
      return this.http.post<any>(this.url + "/makeReservation", body, httpOptions);
    }
}
