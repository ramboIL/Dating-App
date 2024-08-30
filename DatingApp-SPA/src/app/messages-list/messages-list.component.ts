import { Component, OnInit } from '@angular/core';
import {
  IAllMessages,
  IMessage,
  UsersService,
} from '../_services/users.service';

@Component({
  selector: 'app-messages-list',
  templateUrl: './messages-list.component.html',
  styleUrls: ['./messages-list.component.css'],
})
export class MessagesListComponent implements OnInit {
  messages: IAllMessages[][] = [];

  get authUserName() {
    return this.usersSvc.getAuthUserName();
  }

  constructor(private usersSvc: UsersService) {}

  async ngOnInit() {
    this.loadMessages();
  }

  async loadMessages() {
    const username = this.authUserName;
    try {
      this.messages = await this.usersSvc.getAllMessages(username);
    } catch (err) {
      console.error('Error loading messages', err);
    }
  }

  removeFromList(message: IAllMessages) {
    for (let i = 0; i < this.messages.length; i++) {
      for (let j = 0; j < this.messages[i].length; j++) {
        if (
          this.messages[i][j].sender === message.sender &&
          this.messages[i][j].receiver === message.receiver &&
          this.messages[i][j].content === message.content &&
          this.messages[i][j].timestamp === message.timestamp
        ) {
          this.messages[i].splice(j, 1);
          if (this.messages[i].length === 0) {
            this.messages.splice(i, 1);
          }
          return;
        }
      }
    }
  }
}
