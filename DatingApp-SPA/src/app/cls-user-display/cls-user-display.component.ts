import { Component, Input, OnInit } from '@angular/core';
import { Gender, IUser } from '../_services/auth.service';

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

  get userImages() {
    if (this.user.images.length > 0) return this.user.images;
    return this.user.gender === Gender.Male
      ? this.maleDefaultImg
      : this.femaleDefaultImg;
  }

  get userProfileImage() {
    if (this.user.profilePicture) return this.user.profilePicture;
    return this.user.gender === Gender.Male
      ? this.maleDefaultProfile
      : this.femaleDefaultProfile;
  }

  constructor() {}

  ngOnInit(): void {}

  clickLike() {
    return;
  }
}
