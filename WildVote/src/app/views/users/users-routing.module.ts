import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users.component';
import { RegisterComponent } from './register/register.component';
import { EditComponent } from './edit/edit.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Users'
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: UsersComponent,
        data: {
          title: 'Users'
        }
      },
      {
        path: ':userID',
        component: EditComponent,
        data: { title: 'Users'}
      },
      {
        path: 'register',
        pathMatch: 'full',
        component: RegisterComponent,
        data: {
          title: 'Register'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }


