import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-success-pay',
  templateUrl: './success-pay.component.html',
  styleUrls: ['./success-pay.component.scss']
})
export class SuccessPayComponent {
  userHasPaid: number = 0;
  balance: number = 0;

  constructor(private userService : UserService, private router: Router) { }

  ngOnInit(): void {
    this.userHasPaid = this.userService.moneyToTransfer;
    this.balance = this.userService.balance + this.userHasPaid;
  }

  reservation() {
    this.router.navigate(['/dashboard']).then(() => {
      window.location.reload();
    }
    );
  }

}
