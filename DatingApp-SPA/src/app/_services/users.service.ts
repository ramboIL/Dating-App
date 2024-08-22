import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUser } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // Function to fetch the list of users
  async getUsers() {
    return await this.http.get<IUser[]>(`${this.apiUrl}/users`);
  }
}
