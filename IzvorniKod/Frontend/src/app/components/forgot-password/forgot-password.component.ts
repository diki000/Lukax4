import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  email: string = "";
  digit1: string = '';
  digit2: string = '';
  digit3: string = '';
  digit4: string = '';
  digit5: string = '';
  sentCode: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  showEnterEmailForm: boolean = true;

  showVerificationCodeForm: boolean = false;
  showWrongCodeMessage: boolean = false;

  showPasswordResetForm: boolean = false;
  showWrongPasswordMessage: boolean = false;
    constructor(private userService:UserService, private router:Router)
    {

    }

  focusNext(nextDigit: number) {
    const nextInput = document.getElementById(`digit${nextDigit}`) as HTMLInputElement;
    if (nextInput) {
      nextInput.focus();
    }
  }

  onSendCode() {
    this.sentCode = '' //ovo je u slucaju da se vise puta klikne na reset(da se ne dodaje 5 znamenki na jos 5 znamenki na jos...)
    this.userService.getRecoveryEmail(this.email).subscribe(
        (data) => {
          this.sentCode = data.toString();
        },
        (error) => {
          console.log(error);
        }
      );
    
    this.showEnterEmailForm = false;
    this.showVerificationCodeForm = true;
  }

  onSubmitCode() {
    const code = this.digit1 + this.digit2 + this.digit3 + this.digit4 + this.digit5;
    if (code == this.sentCode) {
        this.showVerificationCodeForm = false;
        this.showPasswordResetForm = true;
    } else {
        this.showWrongCodeMessage = true;
    }
  }

  onNewPassword() {
    if (this.newPassword === this.confirmPassword) {
      this.userService.changePassword(this.email, this.newPassword).subscribe((data) => {
        this.router.navigate(['/login']);
        window.alert("Uspjesno promijenjena lozinka")
      },
      (error) => {
        console.log(error);
      }
    );
      this.showWrongPasswordMessage = false;
    } else {
      console.log('Passwords do not match');
      this.showWrongPasswordMessage = true;
    }
  }
}

