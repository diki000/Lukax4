import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  roleOptions = [
    { value: 1, label: 'Klijent' },
    { value: 2, label: 'Voditelj Parkinga' }
  ];

  constructor(private builder: FormBuilder,private service:AuthService,
    private router:Router) {

  }

  registrationForm=this.builder.group({
    username:this.builder.control('',Validators.compose([Validators.required,Validators.minLength(5)])),
    name:this.builder.control('',Validators.required),
    surname:this.builder.control('',Validators.required),
    password:this.builder.control('',Validators.compose([Validators.required])),
    email:this.builder.control('',Validators.compose([Validators.required,Validators.email])),
    ibanRacun:this.builder.control('',Validators.required),  
    role:this.builder.control('',Validators.required),
    file: this.builder.control('',Validators.required)
  });


  //Napraviti fj za ucitavanje slike

  proceedRegistration(){
   if(this.registrationForm.valid){
      this.service.Proceedregister(this.registrationForm.value).subscribe(res => {
       console.log("")
       this.router.navigate(['login']); 
      });
    }else{
      console.log("Error invalid form");
    }
  }

}
