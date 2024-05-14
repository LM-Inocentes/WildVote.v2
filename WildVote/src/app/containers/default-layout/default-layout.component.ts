import { Component, OnInit } from '@angular/core';
import { navItems } from './_nav';
import { navItemsUser } from './_nav_user'
import { navItemsGeneral } from './_nav_general'
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/shared/models/User';
import { INavData } from '@coreui/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
})
export class DefaultLayoutComponent implements OnInit {
  user!: User;
  public navItems = navItems;
  public navItemsUser = navItemsUser;
  public navItemsGeneral = navItemsGeneral;
  public accountsettings!: INavData[];
  public scannav: INavData[] = [
    {
      name: 'Scan',
      url: '/scan',
      iconComponent: { name: 'cilFingerprint' },
    },
  ];
  
  public logoutnav: INavData[] = [
    {
      name: 'Logout',
      url: '/logout',
      iconComponent: { name: 'cil-power-standby' },
    },
  ];
  
  
  constructor(private authService: AuthService, private router: Router) {
  }

  
  ngOnInit(): void {
    this.authService.userObservable.subscribe((newUser) => {
      this.user = newUser;
      this.accountsettings = [
        {
          name: 'Settings',
          url: '/users/'+this.user.id,
          iconComponent: { name: 'cil-address-book' },
        },
      ];
    });
    
  }


  logout() {
    this.authService.resetFingerPrintLogin();
    this.authService.resetLogout({id: this.user.id}).subscribe();
    this.authService.Logout();
    window.location.reload();
  }
  navigateAcc(){
    this.router.navigate(['/users', this.user.id]);
  }
}
