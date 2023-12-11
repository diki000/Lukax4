import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map, take, tap } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class IsAuthenicatedGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router){

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.userService.isLoggedIn().pipe(
        take(1),                             
        map((isLoggedIn: boolean) => {  
          if (!isLoggedIn){
            this.router.navigate(['/login']);  
            return false;
          }
          return true;
        }
        )
      )
    }
}
