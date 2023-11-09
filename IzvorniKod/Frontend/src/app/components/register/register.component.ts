import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';

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
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      file: new FormControl('', [Validators.required]),
      ibanRacun: new FormControl('', [Validators.required])  
    });
  }


  //Napraviti fj za ucitavanje slike

  proceedRegistration(){
   if(this.registrationForm.valid){
    let newUser = {
      firstName: this.registrationForm.value.firstname,
      lastName: this.registrationForm.value.lastname,
      username: this.registrationForm.value.username,
      password: this.registrationForm.value.password,
      email: this.registrationForm.value.email,
      role: this.registrationForm.value.role,
      ibanRacun: this.registrationForm.value.ibanRacun,
      image: this.registrationForm.value.file
    }
    console.log(newUser);
   }
   else{
     console.log("Forma nije validna");
   }

  }

}
