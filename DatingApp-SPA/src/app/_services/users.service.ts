import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUser } from './auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IUpdateUser } from '../update-profile-page/update-profile-page.component';

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

  getUserProfile(username: string): Promise<IUpdateUser> {
    return this.http
      .get<IUpdateUser>(`${this.apiUrl}/user/profile/${username}`)
      .toPromise();
  }

  async sendMessage(
    senderUsername: string,
    receiverUsername: string,
    content: string
  ) {
    return await this.http.post(`${this.apiUrl}/message`, {
      senderUsername,
      receiverUsername,
      content,
    });
  }

  // Function to fetch messages for the logged-in user
  async getAllMessages(username: string): Promise<IAllMessages[][]> {
    try {
      const response = await this.http
        .get<IAllMessages[][]>(`${this.apiUrl}/messages/${username}`)
        .toPromise();
      return response ?? []; // Return empty array if response is null or undefined
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error; // Re-throw the error so it can be handled in the component
    }
  }

  async deleteMessage(
    senderUsername: string,
    receiverUsername: string,
    content: string,
    timestamp: string
  ) {
    return await this.http
      .post(`${this.apiUrl}/messages/delete`, {
        senderUsername,
        receiverUsername,
        content,
        timestamp,
      })
      .toPromise();
  }

  async updateUserProfile(
    currentUsername: string,
    updateData: IUpdateUser
  ): Promise<IUpdateUser> {
    return await this.http
      .put<IUpdateUser>(
        `${this.apiUrl}/user/profile/${currentUsername}`,
        updateData
      )
      .toPromise();
  }
}

export interface IMessage {
  content: string;
}

export interface IAllMessages {
  sender: IUser;
  receiver: IUser;
  content: string;
  timestamp: string;
}
