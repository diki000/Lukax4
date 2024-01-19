import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { IsAuthenicatedGuard } from './guards/is-authenicated.guard';
import { BankTransferComponent } from './components/bank-transfer/bank-transfer.component';
import { SuccessPayComponent } from './components/success-pay/success-pay.component';
import { ReservationComponent } from './components/reservation/reservation.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent
  },

  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'bank-transfer', 
    component: BankTransferComponent,
    canActivate: [IsAuthenicatedGuard]
  },
  {
    path: 'payment-success', 
    component: SuccessPayComponent,
    canActivate: [IsAuthenicatedGuard]
  },
  {
    path: 'reservation',
    component: ReservationComponent,
    canActivate: [IsAuthenicatedGuard]
  },
  {
    path: '', redirectTo: '/dashboard', pathMatch: 'full'
  }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
