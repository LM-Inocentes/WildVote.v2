import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, combineLatest, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { VoteService } from 'src/app/services/vote.service';
import { Election } from 'src/app/shared/models/Election';

interface IUser {
  name: string;
  state: string;
  registered: string;
  country: string;
  usage: number;
  period: string;
  payment: string;
  activity: string;
  avatar: string;
  status: string;
  color: string;
}

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  status!: Election;

  listenusersCount$!: Observable<any>;
  listenusersWhoVotedCount$!: Observable<any>;
  getusersWhoVotedCountPercentage$!: Observable<number>;
  highestVoteCounts$!: Observable<any[]>;
  getAllCandidates$!: Observable<any[]>;
  getAllPresidentCandidates$!: Observable<any[]>;
  getAllVicePresidentCandidates$!: Observable<any[]>;
  getAllSecretaryCandidates$!: Observable<any[]>;
  getAllTreasurerCandidates$!: Observable<any[]>;
  getAllAuditorCandidates$!: Observable<any[]>;
  getAllCpeRepresentativeCandidates$!: Observable<any[]>;
  usersVotedPercentage$!: Observable<string>;
  positions: string[] = [
    'PRESIDENT',
    'VICE-PRESIDENT',
    'SECRETARY',
    'TREASURER',
    'AUDITOR',
    'CPE REPRESENTATIVE'
  ];

  totalPresidentVotes!: number;
  totalVicePresidentVotes!: number;
  totalSecretaryVotes!: number;
  totalTreasurerVotes!: number;
  totalAuditorVotes!: number;
  totalCpeRepresentativeVotes!: number;

  private subscriptions: Subscription = new Subscription();

  constructor(private voteService: VoteService) { }

  ngOnInit(): void {
    if (!localStorage.getItem('foo')) { 
      localStorage.setItem('foo', 'no reload') 
      location.reload() 
    } else {
      localStorage.removeItem('foo') 
    }

    this.listenusersCount$ = this.voteService.listenUsersCount();
    this.listenusersWhoVotedCount$ = this.voteService.listenUsersWhoVotedCount();
    
    this.getusersWhoVotedCountPercentage$ = this.calculatePercentage(this.listenusersWhoVotedCount$, this.listenusersCount$);

    this.subscriptions.add(
      this.voteService.getElectionStatus().subscribe((STATUS) => {
        this.status = STATUS;
      })
    );

    this.highestVoteCounts$ = this.voteService.getHighestVoteCounts();
    this.getAllCandidates$ = this.voteService.getAllCandidates();
    this.getAllPresidentCandidates$ = this.voteService.getAllPresidentCandidates();
    this.getAllVicePresidentCandidates$ = this.voteService.getAllVicePresidentCandidates();
    this.getAllSecretaryCandidates$ = this.voteService.getAllSecretaryCandidates();
    this.getAllTreasurerCandidates$ = this.voteService.getAllTreasurerCandidates();
    this.getAllAuditorCandidates$ = this.voteService.getAllAuditorCandidates();
    this.getAllCpeRepresentativeCandidates$ = this.voteService.getAllCpeRepresentativeCandidates();

    this.subscriptions.add(
      this.getAllPresidentCandidates$.pipe(
        map(candidates => candidates.map(candidate => candidate.Votes)),
        map(votes => votes.reduce((acc, vote) => acc + vote, 0))
      ).subscribe(totalVotes => {
        this.totalPresidentVotes = totalVotes;
      })
    );
    this.subscriptions.add(
      this.getAllVicePresidentCandidates$.pipe(
        map(candidates => candidates.map(candidate => candidate.Votes)),
        map(votes => votes.reduce((acc, vote) => acc + vote, 0))
      ).subscribe(totalVotes => {
        this.totalVicePresidentVotes = totalVotes;
      })
    );
    this.subscriptions.add(
      this.getAllSecretaryCandidates$.pipe(
        map(candidates => candidates.map(candidate => candidate.Votes)),
        map(votes => votes.reduce((acc, vote) => acc + vote, 0))
      ).subscribe(totalVotes => {
        this.totalSecretaryVotes = totalVotes;
      })
    );
    this.subscriptions.add(
      this.getAllTreasurerCandidates$.pipe(
        map(candidates => candidates.map(candidate => candidate.Votes)),
        map(votes => votes.reduce((acc, vote) => acc + vote, 0))
      ).subscribe(totalVotes => {
        this.totalTreasurerVotes = totalVotes;
      })
    );
    this.subscriptions.add(
      this.getAllAuditorCandidates$.pipe(
        map(candidates => candidates.map(candidate => candidate.Votes)),
        map(votes => votes.reduce((acc, vote) => acc + vote, 0))
      ).subscribe(totalVotes => {
        this.totalAuditorVotes = totalVotes;
      })
    );
    this.subscriptions.add(
      this.getAllCpeRepresentativeCandidates$.pipe(
        map(candidates => candidates.map(candidate => candidate.Votes)),
        map(votes => votes.reduce((acc, vote) => acc + vote, 0))
      ).subscribe(totalVotes => {
        this.totalCpeRepresentativeVotes = totalVotes;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  calculatePercentage(
    source1$: Observable<number>,
    source2$: Observable<number>
  ): Observable<number> {
    return combineLatest([source1$, source2$]).pipe(
      map(([source1Data, source2Data]) => {
        if (source2Data === 0) {
          return 0; // Handle division by zero scenario
        } else {
          return (source1Data / source2Data) * 100;
        }
      })
    );
  }
}