import { Component, OnInit } from '@angular/core';
import { CandidatesService } from 'src/app/services/candidates.service';
import { VoteService } from 'src/app/services/vote.service';
import { Candidate } from 'src/app/shared/models/Candidate';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-manage-candidate',
  templateUrl: './manage-candidate.component.html',
  styleUrl: './manage-candidate.component.scss'
})
export class ManageCandidateComponent implements OnInit{
  candidates!: Candidate[];
  public liveDemoVisible = false;
  isElectionStart$!: Observable<boolean>;
  candidateElectionPresident: any;
  candidateElectionVicePresident: any;
  candidateElectionSecretary: any;
  candidateElectionTreasurer: any;
  candidateElectionAuditor: any;
  candidateElectionCPERepresentative: any;
  highestVoteCounts$!: Observable<any[]>;
  
  voteResult = 
    {
      President: '',
      VicePresident: '',
      Secretary: '',
      Treasurer: '',
      Auditor: '',
      CPERepresentative: '',
    };
    

  brandData = [
    {
      imageUrl: 'https://res.cloudinary.com/de4dinse3/image/upload/v1712139652/Candidates/SECRETARY/20-3065-505.png',
      icon: '',
      values: [{ title: 'EZ Partylist ', value: 'LM Inocentes' }],
      capBg: { '--cui-card-cap-bg': '#3b5998' },
      color: 'warning',
    }
  ];

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

  startElection(): void{
    //this.voteService.uploadCandidates(this.candidates).subscribe();
    this.voteService.setElectionStatus(true).subscribe();
    console.log(this.voteService.getElectionStatus().subscribe());
  }

  endElection(): void{
    this.voteService.setElectionStatus(false).subscribe();

  }

  constructor(private candidateService: CandidatesService, private formBuilder: UntypedFormBuilder, private voteService: VoteService) { }

  ngOnInit(): void {
    this.isElectionStart$ = this.voteService.getElectionStatus();
    this.highestVoteCounts$ = this.voteService.getHighestVoteCounts();


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

  toggleLiveDemo(candidateId?: string) {
    this.liveDemoVisible = !this.liveDemoVisible;
    console.log(candidateId);
  }

  handleLiveDemoChange(event: boolean) {
    this.liveDemoVisible = event;
  }


}
