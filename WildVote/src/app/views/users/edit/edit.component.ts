import { Component } from '@angular/core';
import { User } from 'src/app/shared/models/User';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service'
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent {
  user = {} as User;

  registerForm = new FormGroup({
    id: new FormControl({ value: '', disabled: true }, [
      Validators.required,
      Validators.minLength(9),
    ]),
    fullname: new FormControl('', [
      Validators.required,
    ]),
    department: new FormControl('', [
      Validators.required,
    ]),
    year: new FormControl('', [
      Validators.required,
    ]),
    password: new FormControl('', [
      Validators.required,
    ]),
  });

  constructor(private toastr: ToastrService, private authService: AuthService, private activatedRoute: ActivatedRoute) {   
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.authService.editUserById(params['userID']).subscribe(User => {
        this.user = User;
        this.registerForm.patchValue({
          id: this.user.id,
          fullname: this.user.Fullname,
          department: this.user.Department,
          year: this.user.Year,
          password: this.user.password,
        });
      });
    });
  }

  editUser() {
    if (this.registerForm.invalid) {
      this.toastr.error('Please check your form fields.', 'Invalid Input');
      return;
    }
    this.authService.editUser({
      id: this.user.id!,
      Fullname: this.registerForm.value.fullname!,
      Department: this.registerForm.value.department!,
      Year: this.registerForm.value.year!,
      password: this.registerForm.value.password!,
    }).subscribe(_ => {
      this.ngOnInit();
    });
  }
}
