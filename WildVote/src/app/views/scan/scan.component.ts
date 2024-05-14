import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { VoteService } from 'src/app/services/vote.service';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.component.html',
  styleUrl: './scan.component.scss'
})
export class ScanComponent {
  MessagePrompt$!: Observable<any>;
  MessagePrompt2$!: Observable<any>;

  constructor(private toastr: ToastrService, private authService: AuthService, private voteService: VoteService) { 
    
  }

  ngOnInit(): void {
    this.authService.setDefaultPrompt("Waiting for Admin");
    this.MessagePrompt$ = this.authService.MessagePrompt();
    this.MessagePrompt$.subscribe(value => {
      if(value == "Fingerprint Saved"){
        this.toastr.success('Fingerprint Saved', 'Success');
        return
      }
    });
  }

}
