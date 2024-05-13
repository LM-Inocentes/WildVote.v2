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
  MessagePrompt2$!: Observable<any>;

  isFingerprintSaved: boolean = false;

  constructor(private toastr: ToastrService, private authService: AuthService, private voteService: VoteService) { 
    
  }

  ngOnInit(): void {
    this.authService.setDefaultPrompt("Press Captures Fingerprint");
    this.MessagePrompt$ = this.authService.MessagePrompt();
    this.MessagePrompt$.subscribe();
  }

  enrollFingerprint(){

    this.authService.cmdFingerprint("register");
  }

  addUser() {

    this.MessagePrompt2$ = this.authService.MessagePrompt();
    this.MessagePrompt2$.subscribe((value) => {
      if(value !== "Fingerprint Saved"){
        this.toastr.error('Fingerprint not Saved. Please Try Again', 'Invalid Fingerprint');
        return
      }
    });

    if (this.registerForm.invalid && this.isFingerprintSaved) {
      this.toastr.error('Please check your form fields.', 'Invalid Input');
      return;
    }
    
    const user:User = {
      id: this.registerForm.value.id!,
      FingerprintRegistered: true,
      FingerprintIndex: 2
    }

    this.authService.register(user).subscribe(_ => {
     
    });
  }


}
