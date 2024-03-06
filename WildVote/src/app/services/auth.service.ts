import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { User } from '../shared/models/User';
import { GET_USERS_URL, GET_USER_BY_ID_URL, LOGIN_URL, REGISTER_URL } from '../shared/apiURLs/URLs';

const USER_KEY = 'User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<User>(this.getUserFromLocalStorage());
  public userObservable: Observable<User>;

  constructor( private http:HttpClient, private toastrService: ToastrService, private router: Router) { 
    this.userObservable = this.userSubject.asObservable();
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
