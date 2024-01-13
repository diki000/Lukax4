import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { UserService } from './services/user.service';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Programsko inženjerstvo';
  loggedIn$ : Observable<boolean> | undefined;
  constructor(private http: HttpClient, private userService: UserService) { }

  ngOnInit(): void {
    this.loggedIn$ = this.userService.isLoggedIn();
  }
}
