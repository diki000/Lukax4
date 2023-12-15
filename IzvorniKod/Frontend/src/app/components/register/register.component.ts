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
    this.userService.logout();
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
      this.registrationForm.value.role,
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imx1a2EiLCJwYXNzd29yZCI6Imxvemlua2ExIiwicm9sZUlEIjoiMSJ9.vLnJdDsQcYlWOf-Ng5Jw6DkAwPYM7PUb1x-Z-K3C1Uk"
    );
     this.userService.register(newUser).subscribe({ next: (result) => {
      this.uploadImg(newUser.Username);
     },
     error: (error) => {
       console.log(error);
       window.alert("Error registering user")
     }
    });

}
  
  onFileSelected(event: any){
    this.fileToUpload = event.target.files;
  }

  uploadImg(username: string) {
    const formData = new FormData();
    if (this.fileToUpload) {
      formData.append('files', this.fileToUpload[0]);
    }
    formData.append('username', username.toString());

    this.userService.postImage(formData).subscribe(
      (response) => {
        this.router.navigate(['/login']);
      },
      (error) => {
        console.log(error);
        window.alert("Error uploading image")
      }
    );
  }

}
