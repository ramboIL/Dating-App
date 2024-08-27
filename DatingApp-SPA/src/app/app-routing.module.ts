import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersListComponent } from './users-list/users-list.component';
import { RegisterComponent } from './register/register.component';
import { MathcesUsersComponent } from './mathces-users/mathces-users.component';

const routes: Routes = [
  { path: 'matches', component: MathcesUsersComponent },
  { path: 'list', component: UsersListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
