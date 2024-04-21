import { Component, OnInit } from '@angular/core';
import { CandidatesService } from 'src/app/services/candidates.service';
import { Candidate } from 'src/app/shared/models/Candidate';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { VoteService } from 'src/app/services/vote.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/shared/models/User';

@Component({
  selector: 'app-voting-system',
  templateUrl: './voting-system.component.html',
  styleUrl: './voting-system.component.scss'
})
export class VotingSystemComponent {
  user!: User;
  candidates!: Candidate[];
  public liveDemoVisible = false;
  isElectionStart$!: Observable<boolean>;
  candidateElectionPresident: any;
  candidateElectionVicePresident: any;
  candidateElectionSecretary: any;
  candidateElectionTreasurer: any;
  candidateElectionAuditor: any;
  candidateElectionCPERepresentative: any;
  
  voteResult = 
    {
      President: '',
      VicePresident: '',
      Secretary: '',
      Treasurer: '',
      Auditor: '',
      CPERepresentative: '',
    };
    

  PresidentVote = new UntypedFormGroup({
    PresidentVoteID: new UntypedFormControl('President')
  });

  setPresidentVoteValue(id: string): void {
    this.PresidentVote.setValue({ PresidentVoteID: id });
    this.voteResult.President = this.PresidentVote.value.PresidentVoteID;
  }

  VicePresidentVote = new UntypedFormGroup({
    VicePresidentVoteID: new UntypedFormControl('VicePresident')
  });

  setVicePresidentVoteValue(id: string): void {
    this.VicePresidentVote.setValue({ VicePresidentVoteID: id });
    this.voteResult.VicePresident = this.VicePresidentVote.value.VicePresidentVoteID;
  }

  SecretaryVote = new UntypedFormGroup({
    SecretaryVoteID: new UntypedFormControl('Secretary')
  });

  setSecretaryVoteValue(id: string): void {
    this.SecretaryVote.setValue({ SecretaryVoteID: id });
    this.voteResult.Secretary = this.SecretaryVote.value.SecretarytVoteID;
  }

  TreasurerVote = new UntypedFormGroup({
    TreasurerVoteID: new UntypedFormControl('Treasurer')
  });

  setTreasurerVoteValue(id: string): void {
    this.TreasurerVote.setValue({ TreasurerVoteID: id });
    this.voteResult.Treasurer = this.TreasurerVote.value.TreasurerVoteID;
  }

  AuditorVote = new UntypedFormGroup({
    AuditorVoteID: new UntypedFormControl('Auditor')
  });

  setAuditorVoteValue(id: string): void {
    this.AuditorVote.setValue({ AuditorVoteID: id });
    this.voteResult.Auditor = this.AuditorVote.value.AuditorVoteID;
  }

  CPERepresentativeVote = new UntypedFormGroup({
    CPERepresentativeVoteID: new UntypedFormControl('CPERepresentative')
  });

  setCPERepresentativeVoteValue(id: string): void {
    this.CPERepresentativeVote.setValue({ CPERepresentativeVoteID: id });
    this.voteResult.CPERepresentative = this.CPERepresentativeVote.value.CPERepresentativeVoteID;
  }

  submitVoteResult(): void{
    console.log(this.voteResult);
    Object.values(this.voteResult).forEach(position => {
      if(position===''){
        return;
      }
      this.voteService.updateVoteCounts(position).subscribe();  // Perform operations on each position's value here
    });
  }

 

  constructor(private candidateService: CandidatesService, private voteService: VoteService, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.userObservable.subscribe((loggedInUser) => {
      this.user = loggedInUser;
    });

    this.isElectionStart$ = this.voteService.getElectionStatus();
    this.candidateService.getCandidates().subscribe((candidates) => {
      this.candidates = candidates;
      this.sortCandidatesByPosition();
     
      this.candidateElectionPresident = this.candidates
      .filter((candidate: Candidate) => candidate.Position === 'PRESIDENT') // Filter by position
      .map((candidate: Candidate) => ({
        imageUrl: candidate.Profile, 
        icon: '',
        values: [{ title: candidate.PartyList, value: candidate.Fullname }], 
        capBg: { '--cui-card-cap-bg': '#3b5998' },
        color: candidate.color,
        id: candidate.id,
        Fullname: candidate.Fullname,
        PartyList: candidate.PartyList,
        Position: candidate.Position,
        Votes: candidate.Votes,
      }));

      this.candidateElectionVicePresident = this.candidates
      .filter((candidate: Candidate) => candidate.Position === 'VICE-PRESIDENT') // Filter by position
      .map((candidate: Candidate) => ({
        imageUrl: candidate.Profile, 
        icon: '',
        values: [{ title: candidate.PartyList, value: candidate.Fullname }], 
        capBg: { '--cui-card-cap-bg': '#3b5998' },
        color: candidate.color,
        id: candidate.id,
        Fullname: candidate.Fullname,
        PartyList: candidate.PartyList,
        Position: candidate.Position,
        Votes: candidate.Votes,
      }));

      this.candidateElectionSecretary = this.candidates
      .filter((candidate: Candidate) => candidate.Position === 'SECRETARY') // Filter by position
      .map((candidate: Candidate) => ({
        imageUrl: candidate.Profile, 
        icon: '',
        values: [{ title: candidate.PartyList, value: candidate.Fullname }], 
        capBg: { '--cui-card-cap-bg': '#3b5998' },
        color: candidate.color,
        id: candidate.id,
        Fullname: candidate.Fullname,
        PartyList: candidate.PartyList,
        Position: candidate.Position,
        Votes: candidate.Votes,
      }));
      
      this.candidateElectionTreasurer = this.candidates
      .filter((candidate: Candidate) => candidate.Position === 'TREASURER') // Filter by position
      .map((candidate: Candidate) => ({
        imageUrl: candidate.Profile, 
        icon: '',
        values: [{ title: candidate.PartyList, value: candidate.Fullname }], 
        capBg: { '--cui-card-cap-bg': '#3b5998' },
        color: candidate.color,
        id: candidate.id,
        Fullname: candidate.Fullname,
        PartyList: candidate.PartyList,
        Position: candidate.Position,
        Votes: candidate.Votes,
      }));

      this.candidateElectionAuditor = this.candidates
      .filter((candidate: Candidate) => candidate.Position === 'AUDITOR') // Filter by position
      .map((candidate: Candidate) => ({
        imageUrl: candidate.Profile, 
        icon: '',
        values: [{ title: candidate.PartyList, value: candidate.Fullname }], 
        capBg: { '--cui-card-cap-bg': '#3b5998' },
        color: candidate.color,
        id: candidate.id,
        Fullname: candidate.Fullname,
        PartyList: candidate.PartyList,
        Position: candidate.Position,
        Votes: candidate.Votes,
      }));

      this.candidateElectionCPERepresentative = this.candidates
      .filter((candidate: Candidate) => candidate.Position === 'CPE REPRESENTATIVE') // Filter by position
      .map((candidate: Candidate) => ({
        imageUrl: candidate.Profile, 
        icon: '',
        values: [{ title: candidate.PartyList, value: candidate.Fullname }], 
        capBg: { '--cui-card-cap-bg': '#3b5998' },
        color: candidate.color,
        id: candidate.id,
        Fullname: candidate.Fullname,
        PartyList: candidate.PartyList,
        Position: candidate.Position,
        Votes: candidate.Votes,
      }));
      });
  }

  sortCandidatesByPosition(): void {
    const customOrder = [
      "PRESIDENT",
      "VICE-PRESIDENT",
      "SECRETARY",
      "TREASURER",
      "AUDITOR",
      "ARCH REPRESENTATIVE",
      "CHE REPRESENTATIVE",
      "CE REPRESENTATIVE",
      "CPE REPRESENTATIVE",
      "EE REPRESENTATIVE",
      "ECE REPRESENTATIVE",
      "IE REPRESENTATIVE",
      "ME REPRESENTATIVE",
      "EM REPRESENTATIVE",
      "CS REPRESENTATIVE",
      "IT REPRESENTATIVE",
      "CNAHS REPRESENTATIVE",
      "CMBA REPRESENTATIVE",
      "CASE REPRESENTATIVE",
      "CCJ REPRESENTATIVE",
    ];

    this.candidates.sort((a, b) => {
      const indexA = customOrder.indexOf(a.Position);
      const indexB = customOrder.indexOf(b.Position);
      return indexA - indexB;
    });
  }

  removeCandidate(id:string){
    this.candidateService.deleteCandidateByID(id).subscribe(_ => {
      this.ngOnInit();
    });
  }

  toggleLiveDemo() {
    this.liveDemoVisible = !this.liveDemoVisible;
  }

  handleLiveDemoChange(event: boolean) {
    this.liveDemoVisible = event;
  }

}
