import { ChangeDetectorRef, Component, Input } from '@angular/core';

import { HeaderComponent } from '@coreui/angular';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/shared/models/User';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
})
export class DefaultHeaderComponent extends HeaderComponent {

  @Input() sidebarId: string = "sidebar";

  public newMessages = new Array(4)
  public newTasks = new Array(5)
  public newNotifications = new Array(5)
  user!: User;

  constructor(private authService: AuthService, private cdr: ChangeDetectorRef ) {
    super();
    
  }

  ngOnInit(): void {
    this.authService.userObservable.subscribe((newUser) => {
      this.user = newUser;
    });
  }

  logout() {
    this.authService.Logout();
    this.cdr.detectChanges();
  }
}
