import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  url: string = "https://localhost:7020/api/Admin";
  
  constructor(private http: HttpClient) { }

  public getAllUnapprovedManagers() : Observable<User[]>{
    return this.http.get<User[]>(this.url + "/GetUnacceptedManagers");
  }

  public acceptManager(username: string) : Observable<void>{
    return this.http.get<void>(this.url + "/AcceptManager?username=" + username);
  }

  public declineManager(username: string) : Observable<void>{
    return this.http.get<void>(this.url + "/DeclineManager?username=" + username);
  }

  public getAllUsers() : Observable<User[]>{
    return this.http.get<User[]>(this.url + "/GetAllUsers");
  }

  public updateUser(user: User) : Observable<void>{
    console.log(user);
    return this.http.post<void>(this.url + "/UpdateUser", user);
  }

  public deleteUser(username: string) : Observable<void>{
    return this.http.delete<void>(this.url + "/DeleteUser?username=" + username);
  }
  
}
