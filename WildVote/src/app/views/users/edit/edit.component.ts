import { Component } from '@angular/core';
import { User } from 'src/app/shared/models/User';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service'
import { ActivatedRoute } from '@angular/router';
import { VoteService } from 'src/app/services/vote.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent {
  user = {} as User;

  registerForm = new FormGroup({
    id: new FormControl({ value: '', disabled: true }, [
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
    confirmpassword: new FormControl("", [
      Validators.required,
    ]),
  });

  constructor(private toastr: ToastrService, private authService: AuthService, private activatedRoute: ActivatedRoute, private voteService: VoteService) {   
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
          confirmpassword: this.user.password
        });
      });
    });
  }

  deleteUser(id:string){
    this.authService.deleteUserByID(id).subscribe(_ => {
      this.voteService.getUsersCount().subscribe((userCount) => {
        this.voteService.setUsersCount(userCount.userCount);
      });
      this.authService.Logout();
    });
    
  }


  editUser() {
    if (this.registerForm.invalid) {
      this.toastr.error('Please check your form fields.', 'Invalid Input');
      return;
    }
    if (this.registerForm.value.password !== this.registerForm.value.confirmpassword) {
      this.toastr.error('Please input matching password', 'Password do not Match');
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
