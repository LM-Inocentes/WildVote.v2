import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { cilAddressBook, cilInstitution, cilListNumbered, cilLockLocked, cilUser, cilFlagAlt, cilContact } from '@coreui/icons';
import { IconSetService } from '@coreui/icons-angular';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { CandidatesService } from 'src/app/services/candidates.service';
import { Candidate } from 'src/app/shared/models/Candidate';

@Component({
  selector: 'app-add-candidate',
  templateUrl: './add-candidate.component.html',
  styleUrl: './add-candidate.component.scss'
})
export class AddCandidateComponent {
  Profile!: File;

  addCandidateForm = new FormGroup({
    id: new FormControl("", [
      Validators.required,
      Validators.minLength(9)
    ]),
    fullname: new FormControl("", [
      Validators.required,
    ]),
    position: new FormControl("", [
      Validators.required,
    ]),
    partylist: new FormControl("", [
      Validators.required,
    ]),
    department: new FormControl("", [
      Validators.required,
    ]),
    year: new FormControl("", [
      Validators.required,
    ]),
    profile: new FormControl(File, [
      Validators.required,
    ]),
  })

  constructor(public iconSet: IconSetService, private toastr: ToastrService, private authService: AuthService, private candidateService:CandidatesService ) { 
    iconSet.icons = {cilAddressBook, cilUser, cilLockLocked, cilInstitution, cilListNumbered, cilFlagAlt, cilContact};
  }

  onFileChange(event: any): void {
    this.Profile = (event.target as HTMLInputElement).files![0];
  }

  AutoFill(){
    if(!this.addCandidateForm.value.id){
      this.toastr.error('Empty ID Number Field', 'Error');
      return;
    }
    this.authService.getUserById(this.addCandidateForm.value.id).subscribe((user) => {
      this.addCandidateForm.patchValue({
        fullname: user.Fullname,
        department: user.Department,
        year: user.Year,
      });
    });
  }

  addCandidate() {
    if (this.addCandidateForm.invalid) {
      this.toastr.error('Please check your form fields.', 'Invalid Input');
      return;
    }
    const candidate: Candidate = {
      id: this.addCandidateForm.value.id!,
      Fullname: this.addCandidateForm.value.fullname!,
      Department: this.addCandidateForm.value.department!,
      Year: this.addCandidateForm.value.year!,
      Position: this.addCandidateForm.value.position!,
      PartyList: this.addCandidateForm.value.partylist!,
    }
    this.candidateService.addCandidate(
      this.addCandidateForm.value.id!, 
      this.addCandidateForm.value.fullname!,
      this.addCandidateForm.value.department!,
      this.addCandidateForm.value.partylist!,
      this.addCandidateForm.value.position!,
      this.addCandidateForm.value.year!,
      this.Profile
      ).subscribe();
  }
}
