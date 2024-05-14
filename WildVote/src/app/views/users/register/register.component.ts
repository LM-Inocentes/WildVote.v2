import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from 'src/app/shared/models/User';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service'
import { VoteService } from 'src/app/services/vote.service';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { cilAddressBook, cilUser, cilLockLocked, cilInstitution, cilListNumbered} from '@coreui/icons';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit, OnDestroy{

  MessagePrompt$!: Observable<any>;
  MessagePrompt2$!: Observable<any>;
  messagePromptSubscription!: Subscription;

  user = {} as User;
  scanClicked: boolean = false;

  constructor(private toastr: ToastrService, private authService: AuthService, private voteService: VoteService,  private activatedRoute: ActivatedRoute) { 
    
  }

  ngOnInit(): void {
    this.authService.getRegisteredFingerprintUsersCount().subscribe((value) => {
      this.voteService.setUsersFingerprintedCount(value.FingerprintRegisteredUserCount);
    });
    this.authService.cmdFingerprint("default");
    this.authService.setDefaultPrompt("Press Captures Fingerprint");
    this.MessagePrompt$ = this.authService.MessagePrompt();
    this.MessagePrompt$.subscribe();
    this.activatedRoute.params.subscribe((params) => {
      this.authService.editUserById(params['userID']).subscribe(User => {
        this.user = User;
      });
    });
    if (this.messagePromptSubscription) {
      this.messagePromptSubscription.unsubscribe();
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe from messagePromptSubscription to prevent memory leaks
    if (this.messagePromptSubscription) {
      this.messagePromptSubscription.unsubscribe();
    }
  }

  enrollFingerprint(){
    if(this.user.FingerprintRegistered){
      this.toastr.error('User has already registered their fingerprint', 'Unable to Scan');
      return;
    }
    this.authService.cmdFingerprint("register");
    this.scanClicked = !this.scanClicked;
  }

  uploadFingerPrint() {
    this.scanClicked = !this.scanClicked;
    this.MessagePrompt2$ = this.authService.MessagePrompt();
    this.messagePromptSubscription = this.MessagePrompt2$.subscribe((value) => {
      if(value !== "Fingerprint Saved"){
        this.toastr.error('Fingerprint not Saved. Please Try Again', 'Invalid Fingerprint');
        return
      }
        this.authService.getRegisteredFingerprintUsersCount().subscribe((value) => {
          this.authService.submitRegisteredFingerprintToUser({
            id: this.user.id,
            FingerprintRegistered: true,
            FingerprintIndex: value.FingerprintRegisteredUserCount+1
          }).subscribe(_ =>{
              if (this.messagePromptSubscription) {
                this.messagePromptSubscription.unsubscribe();
              }
              this.ngOnInit();
          });
          this.voteService.setUsersFingerprintedCount(value.FingerprintRegisteredUserCount);
        });
    });
    this.authService.cmdFingerprint("default");
  }
}
