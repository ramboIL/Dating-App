import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  IAllMessages,
  IMessage,
  UsersService,
} from '../_services/users.service';

@Component({
  selector: 'cls-message-box',
  templateUrl: './cls-message-box.component.html',
  styleUrls: ['./cls-message-box.component.css'],
})
export class ClsMessageBoxComponent implements OnInit {
  @Input() message: IAllMessages;
  @Output() deleted = new EventEmitter();
  Message: IMessage = {
    content: '',
  };

  get authUserName() {
    return this.usersSvc.getAuthUserName();
  }

  constructor(private usersSvc: UsersService) {}

  ngOnInit(): void {}

  async sendMessage(username) {
    if (!this.Message.content) {
      return;
    }
    const senderUsername = this.authUserName;
    (
      await this.usersSvc.sendMessage(
        senderUsername,
        username,
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

  async deleteMessage(message: IAllMessages) {
    try {
      const senderUsername = message.sender.username;
      const receiverUsername = message.receiver.username;
      const content = message.content;
      const timestamp = message.timestamp;

      await this.usersSvc.deleteMessage(
        senderUsername,
        receiverUsername,
        content,
        timestamp
      );
      this.deleted.emit(true);

      console.log('Message deleted successfully');
    } catch (error) {
      console.error('Error deleting message', error);
    }
  }
}
