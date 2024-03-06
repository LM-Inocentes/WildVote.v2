import { Component } from '@angular/core';
import { User } from '../../shared/models/User';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {

  public users!: User[];

  constructor(private authService: AuthService,) { 
    this.authService.getUsers().subscribe((allUsers) => {
      this.users = allUsers;
    });
  }

}
