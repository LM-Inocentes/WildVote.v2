import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/shared/models/User';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service'
import { VoteService } from 'src/app/services/vote.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit{
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

  MessagePrompt$!: Observable<any>;
  toggle: boolean = true;
  Prmpt: string = '';
  isFingerprintSaved: boolean = false;

  constructor(private toastr: ToastrService, private authService: AuthService, private voteService: VoteService) { 
    
  }

  ngOnInit(): void {
    this.MessagePrompt$ = this.authService.MessagePrompt();
    this.MessagePrompt$.subscribe((value) => {
      if (value === "Fingerprint Saved") {
        console.log(value)
        this.isFingerprintSaved = true;
      }else{
        this.isFingerprintSaved = false;
      }
    });
  }

  setdefault(){
    this.authService.setDefaultPrompt("Press Capture Fingerprint");
    this.toggle = !this.toggle;
  }

  enrollFingerprint(){
    this.toggle = false;
    this.authService.cmdFingerprint("register");
  }

  addUser() {
    if (this.registerForm.invalid && this.isFingerprintSaved) {
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

    this.authService.register(user).subscribe(_ => {
      this.voteService.getUsersCount().subscribe((userCount) => {
        this.voteService.setUsersCount(userCount.userCount);
      });
    });
  }


}
