import { Component, OnInit } from '@angular/core';
import { IUser } from '../_services/auth.service';
import { UsersService } from '../_services/users.service';

@Component({
  selector: 'app-mathces-users',
  templateUrl: './mathces-users.component.html',
  styleUrls: ['./mathces-users.component.css'],
})
export class MathcesUsersComponent implements OnInit {
  mutualLikes: IUser[] = [];

  constructor(private userSvc: UsersService) {}

  async ngOnInit() {
    await this.loadMutualLikes();
  }

  async loadMutualLikes(): Promise<void> {
    const currentUsername = this.userSvc.getAuthUserName();

    (await this.userSvc.getMutualLikes(currentUsername)).subscribe(
      (res) => {
        this.mutualLikes = res;
      },
      (error) => {
        console.error('Error fetching mutual likes:', error);
      }
    );
  }
}
