import { Component, OnInit } from '@angular/core';
import { CandidatesService } from 'src/app/services/candidates.service';
import { Candidate } from 'src/app/shared/models/Candidate';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { VoteService } from 'src/app/services/vote.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/shared/models/User';
import { UserVoteResult } from 'src/app/shared/models/UserVoteResult';
import { Election } from 'src/app/shared/models/Election';

@Component({
  selector: 'app-voting-system',
  templateUrl: './voting-system.component.html',
  styleUrl: './voting-system.component.scss'
})
export class VotingSystemComponent {
  user!: User;
  logggedUser!: User;
  candidates!: Candidate[];
  public liveDemoVisible = false;
  status?: Election;
  candidateElectionPresident: any;
  candidateElectionVicePresident: any;
  candidateElectionSecretary: any;
  candidateElectionTreasurer: any;
  candidateElectionAuditor: any;
  candidateElectionCPERepresentative: any;
  getUserVoteResult!: UserVoteResult;
  positionsArray: any;

  userVoteResult: UserVoteResult = {
      President: {
        id: '',
        Fullname: '',
        PartyList: '',
        color: ''
      },
      VicePresident: {
        id: '',
        Fullname: '',
        PartyList: '',
        color: ''
      },
      Secretary: {
        id: '',
        Fullname: '',
        PartyList: '',
        color: ''
      },
      Treasurer: {
        id: '',
        Fullname: '',
        PartyList: '',
        color: ''
      },
      Auditor: {
        id: '',
        Fullname: '',
        PartyList: '',
        color: ''
      },
      CPERepresentative: {
        id: '',
        Fullname: '',
        PartyList: '',
        color: ''
      },
      id: ''
  }
  
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

  setPresidentVoteValue(id: string, Fullname: string, PartyList: string, color: string, Profile: string): void {
    this.PresidentVote.setValue({
      PresidentVoteID: 
        id,
      });
    this.userVoteResult.President = {
      id,
      Fullname,
      PartyList,
      color,
      Profile
    };
  }

  VicePresidentVote = new UntypedFormGroup({
    VicePresidentVoteID: new UntypedFormControl('VicePresident')
  });

  setVicePresidentVoteValue(id: string, Fullname: string, PartyList: string, color: string, Profile: string): void {
    this.VicePresidentVote.setValue({ 
      VicePresidentVoteID: 
      id,
    });
    this.userVoteResult.VicePresident = {
      id,
      Fullname,
      PartyList,
      color,
      Profile
    };
  }

  SecretaryVote = new UntypedFormGroup({
    SecretaryVoteID: new UntypedFormControl('Secretary')
  });

  setSecretaryVoteValue(id: string, Fullname: string, PartyList: string, color: string, Profile: string): void {
    this.SecretaryVote.setValue({ 
      SecretaryVoteID: 
      id,
    });
    this.userVoteResult.Secretary = {
      id,
      Fullname,
      PartyList,
      color,
      Profile
    };
  }


  TreasurerVote = new UntypedFormGroup({
    TreasurerVoteID: new UntypedFormControl('Treasurer')
  });

  setTreasurerVoteValue(id: string, Fullname: string, PartyList: string, color: string, Profile: string): void {
    this.TreasurerVote.setValue({ 
      TreasurerVoteID: 
      id,
    });
    this.userVoteResult.Treasurer = {
      id,
      Fullname,
      PartyList,
      color,
      Profile
    };
  }

  AuditorVote = new UntypedFormGroup({
    AuditorVoteID: new UntypedFormControl('Auditor')
  });

  setAuditorVoteValue(id: string, Fullname: string, PartyList: string, color: string, Profile: string): void {
    this.AuditorVote.setValue({ 
      AuditorVoteID: 
      id,
    });
    this.userVoteResult.Auditor = {
      id,
      Fullname,
      PartyList,
      color,
      Profile
    };
  }

  CPERepresentativeVote = new UntypedFormGroup({
    CPERepresentativeVoteID: new UntypedFormControl('CPERepresentative')
  });

  setCPERepresentativeVoteValue(id: string, Fullname: string, PartyList: string, color: string, Profile: string): void {
    this.CPERepresentativeVote.setValue({ 
      CPERepresentativeVoteID: 
      id,
    });
    this.userVoteResult.CPERepresentative = {
      id,
      Fullname,
      PartyList,
      color,
      Profile
    };
  }

  submitVoteResult(): void{
    this.userVoteResult.id = this.user.id;
    Object.values(this.userVoteResult).forEach(position => {
      if(position===''||position.id===undefined){
        return;
      }
      this.voteService.updateVoteCounts(position.id).subscribe();  // Perform operations on each position's value here
    });
    this.voteService.submitUserVote(this.userVoteResult).subscribe(_ => {
      this.voteService.getUsersWhoVoted().subscribe((value) => {
        this.voteService.setUsersWhoVoted(value.votedUserCount);
      });
    });
    this.authService.votedUser(this.user).subscribe(_ => {
      this.ngOnInit();
    });
  }

 

  constructor(private candidateService: CandidatesService, private voteService: VoteService, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.userObservable.subscribe((loggedInUser) => {
      this.logggedUser = loggedInUser;
    });
    this.authService.getUserByIdNoToast(this.logggedUser.id).subscribe((getUser) => {
      this.user = getUser;
      if(this.user.Voted){
      this.voteService.getUserVote(this.user.id).subscribe((uservote) => {
        this.getUserVoteResult = uservote;

        this.positionsArray = Object.entries(this.getUserVoteResult)
        .filter(([key, value]) => typeof value === 'object' && value !== null && !Array.isArray(value))
        .map(([key, value]) => ({
          position: key,
          data: value as Candidate // Cast the value to PositionData interface
        }));
      });
      return;
    }
    });
    this.voteService.getElectionStatus().subscribe((STATUS) => {
      this.status = STATUS;
    });

    

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
