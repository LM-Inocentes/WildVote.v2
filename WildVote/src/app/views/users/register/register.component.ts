import { Component } from '@angular/core';
import { User } from 'src/app/shared/models/User';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm = new FormGroup({
    id: new FormControl("", [
      Validators.required,
      Validators.minLength(9)
    ]),
    fullname: new FormControl("", [
      Validators.required,
    ]),
    department: new FormControl("", [
      Validators.required,
    ]),
    year: new FormControl("", [
      Validators.required,
    ]),
    password: new FormControl("", [
      Validators.required,
    ]),
  })

  constructor(private toastr: ToastrService, private authService: AuthService,) { 

  }

  addUser() {
    if (this.registerForm.invalid) {
      this.toastr.error('Please check your form fields.', 'Invalid Input');
      return;
    }
    const user:User = {
      id: this.registerForm.value.id!,
      Fullname: this.registerForm.value.fullname!,
      Department: this.registerForm.value.department!,
      Year: this.registerForm.value.year!,
      password: this.registerForm.value.password!,
    }

    this.authService.register(user).subscribe();
  }


}
