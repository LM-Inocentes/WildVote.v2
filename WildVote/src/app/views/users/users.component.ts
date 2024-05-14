import { Component } from '@angular/core';
import { User } from '../../shared/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { VoteService } from 'src/app/services/vote.service';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  public liveDemoVisible = false;
  public users!: User[];

  constructor(private authService: AuthService, private activatedRoute: ActivatedRoute, private voteService: VoteService) { }

  ngOnInit(): void {
    let UsersObservable: Observable<User[]>;
    this.authService.getUsers().subscribe((allUsers) => {
      this.users = allUsers;
    });

    this.activatedRoute.params.subscribe((params) => {
      if (params['searchTerm']){
        UsersObservable = this.authService.searchUsersByID(params['searchTerm']);
      }else{
        UsersObservable = this.authService.getUsers();
      }
      UsersObservable.subscribe((users) => {
        this.users = users;
      })
    })
  }

  deleteUser(id:string){
    this.authService.getRegisteredFingerprintUsersCount().subscribe((value) => {
      this.voteService.setUsersFingerprintedCount(value.FingerprintRegisteredUserCount);
    });
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
