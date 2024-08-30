import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService, Gender, IUser } from '../_services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  model: IUser = {
    username: '',
    password: '',
    description: '',
    gender: Gender.Male,
  };

  Gender = Gender;

  isRegisterSuccess: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {}

  async register() {
    try {
      const formData = {
        username: this.model.username,
        password: this.model.password,
        description: this.model.description,
        gender: this.model.gender,
      } as IUser;

      (await this.authService.register(formData)).subscribe(
        () => {
          console.log('Registration successful');
        },
        (error) => {
          this.isRegisterSuccess = false;
          console.log(error);
        }
      );
      this.isRegisterSuccess = true;
    } catch (ex) {
      this.isRegisterSuccess = false;
    }
  }

  cancel() {
    this.cancelRegister.emit(false);
    console.log('cancalled');
  }
}
