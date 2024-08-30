import { Component, OnInit } from '@angular/core';
import { IUser } from '../_services/auth.service';
import { UsersService } from '../_services/users.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css'],
})
export class UsersListComponent implements OnInit {
  users: IUser[];
  constructor(private usersSvc: UsersService) {}

  async ngOnInit() {
    await this.getUsersList();
  }

  async getUsersList() {
    const currentUsername = this.usersSvc.getAuthUserName();

    (await this.usersSvc.getUsers(currentUsername)).subscribe(
      (res) => {
        this.users = res; // Res will now include an `isLiked` field for each user
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
