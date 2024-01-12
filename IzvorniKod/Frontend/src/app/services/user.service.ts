import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/User';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url: string = "https://localhost:7020/api/User";
  currentUser: User = new User( 0,"","","","","","",false,0, "");
  private authSubject : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(localStorage.getItem('currentUser') != null);
  private adminSubject : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(localStorage.getItem('currentUser') != null && JSON.parse(localStorage.getItem('currentUser')!).roleID == 3);
  isLoggedIn$ = this.authSubject.asObservable();
  isAdmin$ = this.authSubject.asObservable();
  moneyToTransfer: number = 0;

  updateLoggedInState(status: boolean){
      this.authSubject.next(status);
  }
  updateAdminState(status: boolean){
    this.adminSubject.next(status);
  }

  constructor(private http: HttpClient) { }

  public register(user: User): Observable<User>{
    return this.http.post<User>(this.url + "/Register", user);
  }

  public postImage(data: FormData): Observable<any> {
    return this.http.post<any>(this.url + '/UploadImage', data);
  }

  public login(username: string, password: string): Observable<User>{
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    };
    let body = JSON.stringify({username, password});
    return this.http.post<User>(this.url + "/Login", body, httpOptions);
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


  public setCurrentUser(user: User){
    this.currentUser = user;
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

  public logout(){
    this.currentUser = new User(0,"","","","","","",false,0, "");
    this.authSubject.next(false);
    this.adminSubject.next(false);
    if(localStorage.getItem('currentUser') != null)
      localStorage.removeItem('currentUser');
  }
  
}
