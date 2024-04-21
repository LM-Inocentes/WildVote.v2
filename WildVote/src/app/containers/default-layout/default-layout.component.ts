import { Component } from '@angular/core';
import { navItems } from './_nav';
import { navItemsUser } from './_nav_user'
import { navItemsGeneral } from './_nav_general'
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/shared/models/User';
import { INavData } from '@coreui/angular';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
})
export class DefaultLayoutComponent {
  user!: User;
  public navItems = navItems;
  public navItemsUser = navItemsUser;
  public navItemsGeneral = navItemsGeneral;
  public logoutnav: INavData[] = [
    {
      name: 'Logout',
      url: '/logout',
      iconComponent: { name: 'cil-power-standby' },
    },
  ];
  
  
  constructor(private authService: AuthService) {
    this.authService.userObservable.subscribe((newUser) => {
      this.user = newUser;
    });
  }

  logout() {
    this.authService.Logout();
    window.location.reload();
  }
}
