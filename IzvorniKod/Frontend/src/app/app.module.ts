import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from  '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './components/register/register.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import { AdminComponent } from './components/admin/admin.component';
import { BankTransferComponent } from './components/bank-transfer/bank-transfer.component';
import { SuccessPayComponent } from './components/success-pay/success-pay.component';
import { OwnerComponent } from './components/owner/owner.component';
import { MapComponent } from './components/map/map.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { UnregisteredMapComponent } from './components/unregistered-map/unregistered-map.component';
import { StatisticsComponent } from './components/statistics/statistics.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ForgotPasswordComponent,
    RegisterComponent,
    DashboardComponent,
    NavigationBarComponent,
    AdminComponent,
    BankTransferComponent,
    SuccessPayComponent,
    OwnerComponent,
    MapComponent,
    SidebarComponent,
    UnregisteredMapComponent,
    StatisticsComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
