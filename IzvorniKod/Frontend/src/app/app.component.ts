import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Programsko inženjerstvo';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get('https://localhost:7020/api/Login/testing').subscribe(response => {
      console.log(response);
    }, error => {
      console.log(error);
    })
  }
}
