import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service'
import { User } from 'src/app/shared/models/User';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm = new FormGroup({
    id: new FormControl("", [
      Validators.required,
      Validators.minLength(9)
    ]),
    password: new FormControl("", [
      Validators.required,
    ]),
  })

  constructor(private toastr: ToastrService, private authService: AuthService, private router: Router,) { 
  }

  login() {
    if (this.loginForm.invalid) {
      this.toastr.error('Please check your form fields.', 'Invalid Input');
      return;
    }
    const user:User = {
      id: this.loginForm.value.id!,
      password: this.loginForm.value.password!,
    }

    this.authService.login(user).subscribe(() => {
      this.router.navigateByUrl('/');
    });
  }
}
