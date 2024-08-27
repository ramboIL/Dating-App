import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUser } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // Function to fetch the list of users
  async getUsers(currentUsername: string) {
    return await this.http.get<IUser[]>(
      `${this.apiUrl}/users/${currentUsername}`
    );
  }

  async postLikeUser(authusername: string, likedUsername: string) {
    const url = `${this.apiUrl}/like/${authusername}`;
    const body = { likedUsername };

    return await this.http.post(url, body);
  }

  // Function to get the list of matches
  async getMutualLikes(currentUsername: string) {
    return this.http.get<IUser[]>(`${this.apiUrl}/matches/${currentUsername}`);
  }

  getAuthUserName() {
    const token = localStorage.getItem('token');
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    const userData = JSON.parse(jsonPayload);
    return userData.username;
  }
}
