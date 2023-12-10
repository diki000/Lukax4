import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent implements OnInit{
  loggedIn$ : Observable<boolean> | undefined;

  constructor(private userService : UserService, private router: Router) { }

  ngOnInit(): void {
    this.loggedIn$ = this.userService.isLoggedIn()
  }
  logOut(){
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}
