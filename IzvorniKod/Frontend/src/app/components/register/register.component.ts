import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { UserService } from 'src/app/services/user.service';

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
  fileToUpload: File[] | null = null;


  constructor(private builder: FormBuilder,
    private router:Router, private userService: UserService) {

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

    let newUser = new User(
      this.registrationForm.value.username,
      this.registrationForm.value.password,
      this.registrationForm.value.firstname,
      this.registrationForm.value.lastname,
      this.registrationForm.value.ibanRacun,
      this.registrationForm.value.email,
      false,
      this.registrationForm.value.role
    );
     this.userService.register(newUser).subscribe({ next: (result) => {
      this.uploadImg(newUser.Username);
     }
    });

}
  
  onFileSelected(event: any){
    this.fileToUpload = event.target.files;
  }

  uploadImg(username: string) {
    console.log(username);
    const formData = new FormData();
    if (this.fileToUpload) {
      formData.append('files', this.fileToUpload[0]);
    }
    formData.append('username', username.toString());

    this.userService.postImage(formData).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }

}
