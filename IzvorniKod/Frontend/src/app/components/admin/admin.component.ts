import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/User';
import { AdminService } from 'src/app/services/admin.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit{
  constructor(private adminService: AdminService, private userService: UserService) { }
  UnapprovedManagers: any[] = [];
  AllUsers: User[] = [];
  isAdmin$ : Observable<boolean> | undefined;

  expandedUsers: Set<number> = new Set<number>();

  ngOnInit(): void {
    this.adminService.getAllUnapprovedManagers().subscribe((data: any[]) => {
      this.UnapprovedManagers = data;
    });
    this.isAdmin$ = this.userService.isAdmin();

    this.adminService.getAllUsers().subscribe((data: any[]) => {
      data.forEach((user) => {
        this.AllUsers.push(new User(user.userId, user.username, user.password, user.name, user.surname, user.iban, user.email, user.isEmailConfirmed, user.roleID, "",user.idImagePath));
      });
      console.log(this.AllUsers);
      this.AllUsers = this.AllUsers.filter((user) => user.RoleId != 3);
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

  expandUser(id: number){
    if(this.expandedUsers.has(id)){
      this.expandedUsers.delete(id);
    }
    else{
      this.expandedUsers.add(id);
    }
  }

  isUserExpanded(id: number): boolean {
    return this.expandedUsers.has(id);
  }

  saveChanges(user: User){
    this.adminService.updateUser(user).subscribe(() => {
      alert("Uspjesno aržuriranje");
    },
    (error) => {
      switch(error.status){
        case 410:
          alert("Nedostupno korisnicko ime");
          break;
        case 414:
          alert("Nedostupan email");
          break;
        case 412:
          alert("Nedostupan IBAN");
          break;
        default:
          alert("Greska");
          break;
      }
    });
  }

  deleteUser(username: string){
    this.adminService.deleteUser(username).subscribe(() => {
      this.AllUsers = this.AllUsers.filter((user) => user.Username != username);
    });
  }
}
