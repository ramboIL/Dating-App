import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = 'http://localhost:3000/';

  constructor(private http: HttpClient) {}

  login(model: any) {
    return this.http.post(this.baseUrl + 'login', model).pipe(
      map((response: any) => {
        const user = response;
        if (user && user.token) {
          localStorage.setItem('token', user.token);
        }
        return user;
      })
    );
  }

  async register(model: IUser) {
    return await this.http.post(this.baseUrl + 'register', model).pipe(
      catchError((error) => {
        // Handle the error and return an observable with an appropriate error message
        console.log('Error registering user');
        return error;
      })
    );
  }
}

export interface IUser {
  username: string;
  password: string;
  profilePicture?: string;
  images?: string[];
  description: string;
  likedUsers?: string[];
  gender: Gender;
  isLiked?: boolean;
}

export enum Gender {
  Male,
  Female,
}
