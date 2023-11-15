import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/User';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit{
  constructor(private adminService: AdminService) { }
  UnapprovedManagers: any[] = [];


  ngOnInit(): void {
    this.adminService.getAllUnapprovedManagers().subscribe((data: any[]) => {
      this.UnapprovedManagers = data;
    });
  }

  approveManager(username: string){
    this.adminService.acceptManager(username).subscribe(() => {
      this.UnapprovedManagers = this.UnapprovedManagers.filter((manager) => manager.username != username);
    });
  }
  declineManager(username: string){
    this.adminService.declineManager(username).subscribe(() => {
      this.UnapprovedManagers = this.UnapprovedManagers.filter((manager) => manager.username != username);
    });
  }
}
