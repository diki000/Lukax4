import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Transaction } from 'src/app/models/Transaction';
import { User } from 'src/app/models/User';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent implements OnInit{
  loggedIn$ : Observable<boolean> | undefined;
  admin$ : Observable<boolean> | undefined;
  openPreview: boolean = true;

  wallet = 0;
  paymentPopup = false;
  amount = 0;
  page = 0;

  transactions : Transaction[] = [];

  constructor(private userService : UserService, private router: Router) { }

  ngOnInit(): void {
    this.loggedIn$ = this.userService.isLoggedIn()

    this.loggedIn$?.subscribe((data) => {
      console.log(data)
      if(data){
        let user = JSON.parse(localStorage.getItem('currentUser')!);
        if(user.roleID != 3){
          this.userService.getBalance(user.id).subscribe((data : any) => {
            this.userService.balance = data.balance;
            this.wallet = data.balance;
          })
  
          this.userService.getTransactions(user.id).subscribe((data) => {
            this.transactions = data.sort((a, b) => {
              return new Date(b.timeAndDate).getTime() - new Date(a.timeAndDate).getTime();
            }
            );
          })
        }

      }
    })
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

  pageChange(fwdOrBwd: number){
    if(fwdOrBwd == 1){
      this.page++;
    } else {
      this.page--;
    }
  }

}
