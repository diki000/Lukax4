import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit{

  roleOptions = [
    { value: 1, label: 'Klijent' },
    { value: 2, label: 'Voditelj Parkinga' }
  ];

  registrationForm: FormGroup = new FormGroup({});
  constructor(private builder: FormBuilder,
    private router:Router) {

  }
  ngOnInit(): void {
    this. registrationForm = new FormGroup({
      role: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.email, Validators.required]),
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      file: new FormControl('', [Validators.required]),
      ibanRacun: new FormControl('', [Validators.required])  
    });
  }


  //Napraviti fj za ucitavanje slike

  proceedRegistration(){
   if(this.registrationForm.valid){

   }
  }

}
