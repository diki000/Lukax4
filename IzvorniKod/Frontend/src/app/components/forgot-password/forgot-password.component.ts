import { Component } from '@angular/core';

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

  focusNext(nextDigit: number) {
    const nextInput = document.getElementById(`digit${nextDigit}`) as HTMLInputElement;
    if (nextInput) {
      nextInput.focus();
    }
  }

  onSendCode() {
    this.sentCode = '' //ovo je u slucaju da se vise puta klikne na reset(da se ne dodaje 5 znamenki na jos 5 znamenki na jos...)
    console.log(`Password reset requested for email: ${this.email}`);
    for (let i = 0; i < 5; i++){
        this.sentCode += Math.floor(Math.random() * 10).toString();
    }
    console.log(`Code sent on email: ${this.sentCode}`);
    window.alert(this.sentCode)
    this.showEnterEmailForm = false;
    this.showVerificationCodeForm = true;
  }

  onSubmitCode() {
    const code = this.digit1 + this.digit2 + this.digit3 + this.digit4 + this.digit5;
    if (code == this.sentCode) {
        console.log("same code")
        this.showVerificationCodeForm = false;
        this.showPasswordResetForm = true;
    } else {
        console.log("wrong code")
        this.showWrongCodeMessage = true;
    }

  }

  onNewPassword() {
    if (this.newPassword === this.confirmPassword) {
      console.log('Password reset successful');
      this.showWrongPasswordMessage = false;
    } else {
      console.log('Passwords do not match');
      this.showWrongPasswordMessage = true;
    }
  }
}

