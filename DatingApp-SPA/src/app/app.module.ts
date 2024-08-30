import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { NavComponent } from './nav/nav.component';
import { AuthService } from './_services/auth.service';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { ClsUserDisplayComponent } from './cls-user-display/cls-user-display.component';
import { UsersListComponent } from './users-list/users-list.component';
import { AppRoutingModule } from './app-routing.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MathcesUsersComponent } from './mathces-users/mathces-users.component';
import { MessagesListComponent } from './messages-list/messages-list.component';
import { ClsMessageBoxComponent } from './cls-message-box/cls-message-box.component';
import { UpdateProfilePageComponent } from './update-profile-page/update-profile-page.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    RegisterComponent,
    ClsUserDisplayComponent,
    UsersListComponent,
    MathcesUsersComponent,
    MessagesListComponent,
    ClsMessageBoxComponent,
    UpdateProfilePageComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BsDropdownModule.forRoot(),
  ],
  providers: [AuthService],
  bootstrap: [AppComponent],
})
export class AppModule {}
