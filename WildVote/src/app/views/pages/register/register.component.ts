import { Component } from '@angular/core';
import { IconSetService } from '@coreui/icons-angular';
import { cilAddressBook, cilUser, cilLockLocked, cilInstitution, cilListNumbered} from '@coreui/icons';
import { User } from 'src/app/shared/models/User';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service'
import { VoteService } from 'src/app/services/vote.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
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
    confirmpassword: new FormControl("", [
      Validators.required,
    ]),
  })

  constructor(public iconSet: IconSetService, private toastr: ToastrService, private authService: AuthService, private voteService: VoteService, private router: Router) { 
    iconSet.icons = {cilAddressBook, cilUser, cilLockLocked, cilInstitution, cilListNumbered};
    this.authService.userObservable.subscribe((currentUser) => {
      if(currentUser.id){
        this.router.navigate(['dashboard']);
        return;
      }
    });
  }

  createAccount() {
    if (this.registerForm.invalid) {
      this.toastr.error('Please check your form fields.', 'Invalid Input');
      return;
    }
    if (this.registerForm.value.password !== this.registerForm.value.confirmpassword) {
      this.toastr.error('Please input matching password', 'Password do not Match');
      return;
    }
    const user:User = {
      id: this.registerForm.value.id!,
      Fullname: this.registerForm.value.fullname!,
      Department: this.registerForm.value.department!,
      Year: this.registerForm.value.year!,
      password: this.registerForm.value.password!,
      FingerprintRegistered: false
    }

    this.authService.register(user).subscribe(_ => {
      this.router.navigate(['/login']);
    });

    this.voteService.getUsersCount().subscribe((userCount) => {
      this.voteService.setUsersCount(userCount.userCount);
    });
  }

}
