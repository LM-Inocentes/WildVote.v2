import { Component } from '@angular/core';
import { navItems } from './_nav';
import { navItemsUser } from './_nav_user'
import { navItemsGeneral } from './_nav_general'
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/shared/models/User';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
})
export class DefaultLayoutComponent {

  public navItems = navItems;
  public navItemsUser = navItemsUser;
  public navItemsGeneral = navItemsGeneral;
  user!: User;
  
  constructor(private authService: AuthService) {
    this.authService.userObservable.subscribe((newUser) => {
      this.user = newUser;
      console.log(this.user.isAdmin == undefined);
    });
  }
}
