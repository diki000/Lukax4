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
  openPreview: boolean = true;

  wallet = 30;
  paymentPopup = false;
  amount = 0;

  transactions = [{
    date : "12.12.2020.",
    amount : 100,
    type : 0
  },
  {
    date : "12.12.2020.",
    amount : 100,
    type : 1
  }]

  constructor(private userService : UserService, private router: Router) { }

  ngOnInit(): void {
    this.loggedIn$ = this.userService.isLoggedIn()
  }
  logOut(){
    this.userService.logout();
    this.router.navigate(['/login']);
  }

  openWalletPreview() {
    this.openPreview = !this.openPreview;
  }

  paymentPopupToggle() {
    this.paymentPopup = !this.paymentPopup;
  }

  sendMoney() {
    this.router.navigate(['/bank-transfer']);
    this.userService.moneyToTransfer = this.amount;
    this.openWalletPreview();
  }
}
