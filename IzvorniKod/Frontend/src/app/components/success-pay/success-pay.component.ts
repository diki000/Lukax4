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

  constructor(private userService : UserService, private router: Router) { }

  ngOnInit(): void {
    this.userHasPaid = this.userService.moneyToTransfer;
  }

  reservation() {
    this.router.navigate(['/dashboard']);
  }

}
