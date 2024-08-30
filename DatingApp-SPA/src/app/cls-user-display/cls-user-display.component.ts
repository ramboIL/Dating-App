import { Component, Input, OnInit } from '@angular/core';
import { Gender, IUser } from '../_services/auth.service';
import { IMessage, UsersService } from '../_services/users.service';

@Component({
  selector: 'app-cls-user-display',
  templateUrl: './cls-user-display.component.html',
  styleUrls: ['./cls-user-display.component.css'],
})
export class ClsUserDisplayComponent implements OnInit {
  maleDefaultProfile = '../../assets/male-avatar-boy-face-man-user-7.svg';
  femaleDefaultProfile =
    '../../assets/female-avatar-girl-face-woman-user-7.svg';

  maleDefaultImg = ['../../assets/pic-man.jpg'];
  femaleDefaultImg = ['../../assets/pic-female.png'];

  @Input() user: IUser;
  @Input() isMatchesPage: boolean = false;

  Message: IMessage = {
    content: '',
  };

  _isLiked: boolean = false;

  get userImages() {
    return this.user.gender === Gender.Male
      ? this.maleDefaultImg
      : this.femaleDefaultImg;
  }

  get userProfileImage() {
    return this.user.gender === Gender.Male
      ? this.maleDefaultProfile
      : this.femaleDefaultProfile;
  }

  get isLiked() {
    return this.user.isLiked;
  }

  constructor(private usersSvc: UsersService) {}

  ngOnInit(): void {}

  async clickLike() {
    this.user.isLiked = !this.user.isLiked;
    (
      await this.usersSvc.postLikeUser(
        this.usersSvc.getAuthUserName(),
        this.user.username
      )
    ).subscribe(
      (response) => {
        console.log('User liked successfully');
      },
      (error) => {
        console.error('Error liking user');
      }
    );
    return;
  }

  async sendMessage() {
    if (!this.Message.content) {
      return;
    }
    const senderUsername = this.usersSvc.getAuthUserName();
    (
      await this.usersSvc.sendMessage(
        senderUsername,
        this.user.username,
        this.Message.content
      )
    ).subscribe(
      (response) => {
        this.Message.content = '';
        console.log('Message sent successfully', response);
      },
      (error) => {
        console.log('Error sending message', error);
      }
    );
  }
}
