import { Component, OnInit, OnDestroy } from '@angular/core';
import { CandidatesService } from 'src/app/services/candidates.service';
import { VoteService } from 'src/app/services/vote.service';
import { Candidate } from 'src/app/shared/models/Candidate';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Observable, Subscription, concatMap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Election } from 'src/app/shared/models/Election';

@Component({
  selector: 'app-manage-candidate',
  templateUrl: './manage-candidate.component.html',
  styleUrl: './manage-candidate.component.scss'
})
export class ManageCandidateComponent implements OnInit, OnDestroy{
  candidates!: Candidate[];
  public liveDemoVisible = false;
  candidateElectionPresident: any;
  candidateElectionVicePresident: any;
  candidateElectionSecretary: any;
  candidateElectionTreasurer: any;
  candidateElectionAuditor: any;
  candidateElectionCPERepresentative: any;

  isElectionStart?: Election;
  highestVoteCounts$!: Observable<any[]>;
  getAllCandidates$!: Observable<any[]>;
  private highestVoteCountsSubscription!: Subscription;
  private getAllCandidatesSubscription!: Subscription;
  
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

  startElection(): void {
    this.voteService.setElectionStatus(true).pipe(
      concatMap(() => this.voteService.uploadCandidates(this.candidates))
    ).subscribe(_ => {
      this.toastr.info('Election Started');
      this.ngOnInit();
    });
  }

  endElection(): void{
    this.voteService.setElectionStatus(false).subscribe();
    this.authService.resetUsersVotes().subscribe();
    this.authService.resetUsersVotesResults().subscribe();
    this.voteService.deleteAllCandidates(this.candidates).subscribe(_ => {
      this.toastr.info('Election Ended');
      this.ngOnInit();
    });

  }

  constructor(private candidateService: CandidatesService, private authService: AuthService, private router: Router,
    private voteService: VoteService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.authService.userObservable.subscribe((currentUser) => {
      if(!currentUser.isAdmin){
        this.router.navigate(['dashboard']);
        return;
      }
    });


    this.voteService.getElectionStatus().subscribe((status) => {
      this.isElectionStart = status;
    });
    
    this.highestVoteCounts$ = this.voteService.getHighestVoteCounts();
    this.getAllCandidates$ = this.voteService.getAllCandidates();

    // Subscribe to observables and handle data
    this.highestVoteCountsSubscription = this.highestVoteCounts$.subscribe();
    this.getAllCandidatesSubscription = this.getAllCandidates$.subscribe();


    this.candidateService.getCandidates().subscribe((candidates) => {
      this.candidates = candidates;
      this.sortCandidatesByPosition(this.candidates);
     
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

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions to prevent memory leaks
    this.highestVoteCountsSubscription.unsubscribe();
    this.getAllCandidatesSubscription.unsubscribe();
  }

  sortCandidatesByPosition(candidates: Candidate[]): void {
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

    candidates.sort((a, b) => {
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
