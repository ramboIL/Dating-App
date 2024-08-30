import { Component, OnInit } from '@angular/core';
import { UsersService } from '../_services/users.service';
import { IUser } from '../_services/auth.service';

@Component({
  selector: 'app-update-profile-page',
  templateUrl: './update-profile-page.component.html',
  styleUrls: ['./update-profile-page.component.css'],
})
export class UpdateProfilePageComponent implements OnInit {
  updatedUser: IUpdateUser = {
    newUsername: '',
    description: '',
  };

  isUpdated: boolean = false;

  get authUserName() {
    return this.usersSvc.getAuthUserName();
  }

  constructor(private usersSvc: UsersService) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  async loadUserProfile() {
    try {
      const authUsername = this.authUserName; // Assume you have this method
      const userProfile = await this.usersSvc.getUserProfile(authUsername);

      this.updatedUser.newUsername = userProfile.newUsername;
      this.updatedUser.description = userProfile.description;
    } catch (error) {
      console.error('Error loading user profile', error);
    }
  }

  async saveUserProfile() {
    try {
      await this.usersSvc.updateUserProfile(
        this.authUserName,
        this.updatedUser
      );
      this.isUpdated = true;
      console.log('User profile updated successfully');
    } catch (error) {
      this.isUpdated = false;
      console.error('Error updating user profile', error);
    }
  }
}

export interface IUpdateUser {
  newUsername: string;
  description: string;
}
