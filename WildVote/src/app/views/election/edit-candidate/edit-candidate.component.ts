import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { cilAddressBook, cilInstitution, cilListNumbered, cilLockLocked, cilUser, cilFlagAlt, cilContact } from '@coreui/icons';
import { IconSetService } from '@coreui/icons-angular';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { CandidatesService } from 'src/app/services/candidates.service';
import { Candidate } from 'src/app/shared/models/Candidate';

@Component({
  selector: 'app-edit-candidate',
  templateUrl: './edit-candidate.component.html',
  styleUrl: './edit-candidate.component.scss'
})
export class EditCandidateComponent {
  Profile!: File;
  candidate = {} as Candidate;

  editCandidateForm = new FormGroup({
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

  constructor(public iconSet: IconSetService, private activatedRoute: ActivatedRoute, private toastr: ToastrService, private candidateService:CandidatesService ) { 
    iconSet.icons = {cilAddressBook, cilUser, cilLockLocked, cilInstitution, cilListNumbered, cilFlagAlt, cilContact};
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.candidateService.getCandidateByID(params['id']).subscribe(Candidate => {
        this.candidate = Candidate;
        this.editCandidateForm.patchValue({
          id: this.candidate.id,
          fullname: this.candidate.Fullname,
          department: this.candidate.Department,
          position: this.candidate.Position,
          partylist: this.candidate.PartyList,
        });
      });
    });
  }

  onFileChange(event: any): void {
    this.Profile = (event.target as HTMLInputElement).files![0];
  }

  editCandidate() {
    if (this.editCandidateForm.invalid) {
      this.toastr.error('Please check your form fields.', 'Invalid Input');
      return;
    }
    const candidate: Candidate = {
      id: this.editCandidateForm.value.id!,
      Fullname: this.editCandidateForm.value.fullname!,
      Department: this.editCandidateForm.value.department!,
      Year: this.editCandidateForm.value.year!,
      Position: this.editCandidateForm.value.position!,
      PartyList: this.editCandidateForm.value.partylist!,
    }
    this.candidateService.addCandidate(
      this.editCandidateForm.value.id!, 
      this.editCandidateForm.value.fullname!,
      this.editCandidateForm.value.department!,
      this.editCandidateForm.value.partylist!,
      this.editCandidateForm.value.position!,
      this.editCandidateForm.value.year!,
      this.Profile
      ).subscribe();
  }

}
