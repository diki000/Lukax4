import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-bank-transfer',
  templateUrl: './bank-transfer.component.html',
  styleUrls: ['./bank-transfer.component.scss']
})
export class BankTransferComponent {

  isValidCardNumber: boolean | null = null;
  isExpired: boolean | null = null;
  isValidCVC: boolean | null = null;

  @ViewChild('cardNumberInput') cardNumberInput!: ElementRef;
  @ViewChild('expirationInput ') expirationInput!: ElementRef;
  @ViewChild('cvcInput') cvcInput!: ElementRef;

  ngAfterViewInit(): void {
    this.initializeCardNumberInput();
  }

  constructor(private router: Router, private userService: UserService) { }

  initializeCardNumberInput() {
    this.cardNumberInput.nativeElement.addEventListener('input', this.formatCardNumber.bind(this));
    this.expirationInput.nativeElement.addEventListener('input', this.formatExpiration.bind(this));
    this.cvcInput.nativeElement.addEventListener('input', this.formatCVC.bind(this));
  }

  formatCardNumber(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    let trimmedValue = inputElement.value.replace(/\s/g, ''); 
    trimmedValue = trimmedValue.replace(/[^0-9]/g, '');
    const regex = /\d{1,4}/g;
    const matches = trimmedValue.match(regex);

    if(trimmedValue.length == 16) {
      this.isValidCardNumber = this.luhnCheck(trimmedValue);
      if(this.isValidCardNumber) {
        this.expirationInput.nativeElement.focus();
      }
    } else if(trimmedValue.length < 16) {
      this.isValidCardNumber = null;
    }

    if (matches) {
      trimmedValue = matches.join(' ');
    }

    inputElement.value = trimmedValue;
  }

  formatExpiration(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    let value = inputElement.value.replace(/\D/g, ''); 
    if(value.length >= 3) {

      const month = value.slice(0, 2);
      const year = value.slice(2, 6);
      
      value = `${month.length === 2 ? month + ' / ' : month}${year}`;
      
      if(value.length == 7) {
        let year1 = "20" + value.slice(5, 7);
        const currentDate = new Date();
        const expirationDate = new Date(Number(year1), Number(month) - 1, 1);

        this.isExpired = expirationDate < currentDate;
        if(!this.isExpired) {
          this.cvcInput.nativeElement.focus();
        }
      } else {
        this.isExpired = null;
      }      
    }
    inputElement.value = value;

    
  }

  formatCVC(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    let value = inputElement.value.replace(/\D/g, ''); 
    if(value.length >= 3) {
      this.isValidCVC = true;
      inputElement.value = value;
      inputElement.blur();
    } else {
      if(this.isValidCVC != null) {
        this.isValidCVC = false;
      }
    }
  }

  luhnCheck(cardNumber: string): boolean {
    let sum = 0;
    let shouldDouble = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber.charAt(i), 10);

      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;

      shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
  }

  pay() {
    if(this.isValidCardNumber && !this.isExpired && this.isValidCVC) {
      let user = this.userService.getDecodedToken()!;
      this.userService.addPayment(user.UserId, this.userService.moneyToTransfer).subscribe((data) => {
        this.userService.getTransactions(user.UserId).subscribe((data) => {
          this.userService.updateTransactions(data);
        });
        this.userService.getBalance(user.UserId).subscribe((data) => {
          this.userService.updateBalance(data);
        });
        this.router.navigate(['/payment-success']);
      })
    } else {
      alert("Sva polja moraju bit zelena");
    }
  }
}
