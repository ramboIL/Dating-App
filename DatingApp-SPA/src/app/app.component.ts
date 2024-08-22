import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'DatingApp';

  loggedIn() {
    const token = localStorage.getItem('token');
    return !!token;
  }
}
