import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersListComponent } from './users-list/users-list.component';
import { RegisterComponent } from './register/register.component';
import { MathcesUsersComponent } from './mathces-users/mathces-users.component';
import { MessagesListComponent } from './messages-list/messages-list.component';
import { UpdateProfilePageComponent } from './update-profile-page/update-profile-page.component';

const routes: Routes = [
  { path: 'matches', component: MathcesUsersComponent },
  { path: 'list', component: UsersListComponent },
  { path: 'messages', component: MessagesListComponent },
  { path: 'profile', component: UpdateProfilePageComponent },
  { path: '**', component: UsersListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
