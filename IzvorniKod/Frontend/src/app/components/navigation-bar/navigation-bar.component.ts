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
  isKlijent$ : Observable<boolean> | undefined;
  currentUser : User | null = null;
  openPreview: boolean = false;

  wallet = 0;
  paymentPopup = false;
  amount = 0;
  page = 0;

  transactions : Transaction[] = [];

  constructor(private userService : UserService, private router: Router) { 
    let token = localStorage.getItem('jwt');
    this.loggedIn$ = this.userService.isLoggedIn();
    this.userService.transactions$.subscribe((data) => {
      this.transactions = data.sort((a, b) => {
        return new Date(b.timeAndDate).getTime() - new Date(a.timeAndDate).getTime();
      }
      );
    })

    this.userService.wallet$.subscribe((data : any) => {
      this.wallet = data.balance;
    })
    this.isKlijent$ = this.userService.isKlijent();
    if(token != undefined){ 
      this.userService.updateLoggedInState(true);
      this.userService.checkToken();
      this.currentUser = this.userService.getCurrentUser(); 
      this.loggedIn$ = this.userService.isLoggedIn();
      if(this.currentUser!.RoleId == 3){
        this.userService.updateAdminState(true);
      }
      else if(this.currentUser!.RoleId == 1){
        this.userService.updateKlijentState(true);
        this.isKlijent$ = this.userService.isKlijent();
        this.userService.getBalance(this.currentUser!.UserId).subscribe((data : any) => {
          this.userService.balance = data.balance;
          this.wallet = data.balance;
        })

        this.userService.getTransactions(this.currentUser!.UserId).subscribe((data) => {
          this.transactions = data.sort((a, b) => {
            return new Date(b.timeAndDate).getTime() - new Date(a.timeAndDate).getTime();
          }
          );
          this.userService.updateTransactions(this.transactions);
        })
      }
    }
    else{
      this.userService.updateLoggedInState(false);
      this.currentUser = null;
    }

  }

  ngOnInit(): void {
  }

  logOut(){
    this.userService.logout();
    this.router.navigate(['/login']);
    this.userService.updateLoggedInState(false);
    this.userService.updateAdminState(false);
    this.userService.updateKlijentState(false);
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
