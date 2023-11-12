import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/User';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url: string = "https://localhost:7020/api/User";
  currentUser: User = new User("","","","","","",false,0);

  constructor(private http: HttpClient) { }

  public register(user: User): Observable<User>{
    console.log("uso")
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
  }

  public getCurrentUser(): User{
    return this.currentUser;
  }
  
  public isLoggedIn(): boolean{
    if(this.currentUser.Username == ""){
      return false;
    }
    return true;
  }

  public logout(){
    this.currentUser = new User("","","","","","",false,0);
  }
  
}
