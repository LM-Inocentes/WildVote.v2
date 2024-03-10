import { Component } from '@angular/core';
import { User } from '../../shared/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  public liveDemoVisible = false;
  public users!: User[];

  constructor(private authService: AuthService, private activatedRoute: ActivatedRoute) { }

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
    this.authService.deleteUserByID(id).subscribe(_ => {
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
