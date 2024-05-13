import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, from, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { User } from '../shared/models/User';
import { ADMIN_USER_URL, DELETE_USER_BY_ID, EDIT_USER_BY_ID_URL, GET_USERS_URL, GET_USER_BY_ID_URL, ISNOTADMIN_USER_URL, LOGIN_URL, REGISTER_URL, RESET_VOTED_USER_URL, SEARCH_USER_BY_ID_URL, USER_VOTE_RESET_RESULT_URL, VOTED_USER_URL } from '../shared/apiURLs/URLs';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import firebase from 'firebase/compat/app';

const USER_KEY = 'User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<User>(this.getUserFromLocalStorage());
  public userObservable: Observable<User>;

  constructor( private http:HttpClient, private toastrService: ToastrService, private router: Router, private db: AngularFireDatabase) { 
    this.userObservable = this.userSubject.asObservable();
  }

  isUserLoggedIn(){
    const isLoggedIn = this.getUserFromLocalStorage();
    console.log((isLoggedIn));
    if(isLoggedIn){
      return true;
    }
    return false;
  }

  login(user: User): Observable<User> {
    return this.http.post<User>(LOGIN_URL, user).pipe(
      tap({
        next: (user) => {
          this.setUserToLocalStorage(user);
          this.userSubject.next(user);
          this.toastrService.success(
            `Welcome ${user.Fullname}!`,
            'Login Successfully'
          )
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Login Failed');
        }

      })
    );
  }

  MessagePrompt(): Observable<any> {
    return this.db.object<any>(`Auth/MessagePrompt`).valueChanges();
  }


  setDefaultPrompt(cmd: string): Observable<void> {
    return from(this.db.object(`Auth/MessagePrompt`).set(cmd));
  }

  cmdFingerprint(cmd: string): Observable<void> {
    return from(this.db.object(`Auth/Status`).set(cmd));
  }

  register( user:User ): Observable<User>{
    return this.http.post<User>(REGISTER_URL, user).pipe(
      tap({
        next: (user) => {
          this.toastrService.success(
            `User ${user.Fullname} Registered`,
            'Success'
          )
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Registration Failed');
        }
      })
    );
  }
  
  getUsers(): Observable<User[]>{
    return this.http.get<User[]>(GET_USERS_URL);
  }

  searchUsersByID(searchTerm: string) {
    return this.http.get<User[]>(SEARCH_USER_BY_ID_URL + searchTerm);
  }

  deleteUserByID(id: string) {
    return this.http.delete(DELETE_USER_BY_ID + id).pipe(
      tap({
        next: (user) => {
          this.toastrService.success(
            `User Deleted`,
            'Success'
          )
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Error');
        }
      })
    );
  }

  editUser(user: User): Observable<User>{
    return this.http.patch<User>(EDIT_USER_BY_ID_URL, user).pipe(
      tap({
        next: (user) => {
          this.toastrService.success(
            `User ${user.id} Updated`,
            'Success'
          )
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Error');
        }
      })
    );
  }

  votedUser(user: User): Observable<User>{
    return this.http.patch<User>(VOTED_USER_URL, user).pipe(
      tap({
        next: (user) => {
          this.toastrService.success(
            `Vote Submitted`,
            'Success'
          )
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Error');
        }
      })
    );
  }

  resetUsersVotes(): Observable<void>{
    return this.http.patch<void>(RESET_VOTED_USER_URL, {});
  }

  resetUsersVotesResults(): Observable<void>{
    return this.http.delete<void>(USER_VOTE_RESET_RESULT_URL);
  }

  setUserAdmin(user: User): Observable<User>{
    return this.http.patch<User>(ADMIN_USER_URL, user).pipe(
      tap({
        next: (user) => {
          this.toastrService.success(
            `User ${user.id} Set as Admin`,
            'Success'
          )
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Error');
        }
      })
    );
  }

  unsetUserAdmin(user: User): Observable<User>{
    return this.http.patch<User>(ISNOTADMIN_USER_URL, user).pipe(
      tap({
        next: (user) => {
          this.toastrService.success(
            `User ${user.id} Revoked Admin Access`,
            'Success'
          )
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Error');
        }
      })
    );
  }

  getUserById( id :string ): Observable<User>{
    return this.http.get<User>(GET_USER_BY_ID_URL+id).pipe(
      tap({
        next: (user) => {
          this.toastrService.success(
            `Match Found`,
            'Success'
          )
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Failed');
        }
      })
    );
  }

  getUserByIdNoToast( id :string ): Observable<User>{
    return this.http.get<User>(GET_USER_BY_ID_URL+id);
  }

  editUserById( id :string ): Observable<User>{
    return this.http.get<User>(GET_USER_BY_ID_URL+id);
  }


  Logout(){
    this.userSubject.next(new User());
    localStorage.removeItem(USER_KEY);
    this.router.navigateByUrl('/');
  }



  setUserToLocalStorage(user:User){
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  getUserFromLocalStorage(): User {
    const userJson = localStorage.getItem(USER_KEY);
  
    try {
      if (userJson) {
        const user: User = JSON.parse(userJson);
        return user;
      }
    } catch (error) {
      console.error('Error parsing user JSON:', error);
    }
    return new User();
  }

}
