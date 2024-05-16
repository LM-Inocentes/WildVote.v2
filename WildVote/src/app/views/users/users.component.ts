import { Component } from '@angular/core';
import { User } from '../../shared/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { VoteService } from 'src/app/services/vote.service';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  public liveDemoVisible = false;
  public users!: User[];
  searchQuery: string = '';
  filteredUser: any[] = [];

  constructor(private authService: AuthService, private activatedRoute: ActivatedRoute, private voteService: VoteService, private router: Router) { }

  ngOnInit(): void {
    this.authService.userObservable.subscribe((loggedinUser) => {
      if(!loggedinUser.isAdmin){
        this.router.navigate(['dashboard']);
        return;
      }
    });
    let UsersObservable: Observable<User[]>;
    this.authService.getUsers().subscribe((allUsers) => {
      this.users = allUsers;
      this.performSearch();
    });
  }

  performSearch() {
    const query = this.searchQuery.trim().toLowerCase();
    if (query) {
      this.filteredUser = this.users.filter(user =>
        user.Fullname!.toLowerCase().includes(query) || 
        user.id.toLowerCase().includes(query)
      );
    } else {
      this.filteredUser = this.users; // Reset to all candidates if query is empty
    }
  }

  deleteUser(id:string){
    this.authService.deleteUserByID(id).subscribe(_ => {
      this.voteService.getUsersCount().subscribe((userCount) => {
        this.voteService.setUsersCount(userCount.userCount);
      });
      this.ngOnInit();
    });
    
  }

  demoteUser(user: User){
    this.authService.unsetUserAdmin(user).subscribe(_ => {
      this.ngOnInit();
    });
  }

  setUserAdmin(user: User){
    this.authService.setUserAdmin(user).subscribe(_ => {
      this.ngOnInit();
    });
  }

  toggleLiveDemo() {
    this.liveDemoVisible = !this.liveDemoVisible;
  }

  handleLiveDemoChange(event: boolean) {
    this.liveDemoVisible = event;
  }

}
