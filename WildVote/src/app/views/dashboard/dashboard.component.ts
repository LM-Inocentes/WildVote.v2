import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

import { DashboardChartsData, IChartProps } from './dashboard-charts-data';
import { Observable, Subscription } from 'rxjs';
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
export class DashboardComponent implements OnInit {
  status!: Election
  usersCount = {
    userCount: 0,
    votedUserCount : 0
  }
  getRtUsersCount$!: Observable<any>;
  getusersCount$!: Observable<any>;
  listenusersCount$!: Observable<any>;
  getusersWhoVotedCount$!: Observable<any>;
  listenusersWhoVotedCount$!: Observable<any>
  highestVoteCounts$!: Observable<any[]>;
  getAllCandidates$!: Observable<any[]>;
  getAllPresidentCandidates$!: Observable<any[]>;
  getAllVicePresidentCandidates$!: Observable<any[]>;
  getAllSecretaryCandidates$!: Observable<any[]>;
  getAllTreasurerCandidates$!: Observable<any[]>;
  getAllAuditorCandidates$!: Observable<any[]>;
  getAllCpeRepresentativeCandidates$!: Observable<any[]>;
  positions: string[] = [
    'PRESIDENT',
    'VICE-PRESIDENT',
    'SECRETARY',
    'TREASURER',
    'AUDITOR',
    'CPE REPRESENTATIVE'
  ];

  constructor(private voteService: VoteService) {
  }

  ngOnInit(): void {
    this.voteService.getUsersCount().subscribe((userCount) => {
      this.usersCount = userCount;
      this.getusersCount$ = this.voteService.setUsersCount(this.usersCount.userCount);
    });
    this.voteService.getUsersWhoVoted().subscribe((userCount) => {
      this.usersCount = userCount;
      this.getusersWhoVotedCount$ = this.voteService.setUsersWhoVoted(this.usersCount.votedUserCount);
    });

    this.listenusersCount$ = this.voteService.listenUsersCount();
    this.listenusersWhoVotedCount$ = this.voteService.listenUsersWhoVotedCount();
    this.listenusersCount$.subscribe();
    this.listenusersWhoVotedCount$.subscribe();
    
    this.voteService.getElectionStatus().subscribe((STATUS) => {
      this.status = STATUS;
    });
    this.getRtUsersCount$;
    this.highestVoteCounts$ = this.voteService.getHighestVoteCounts();
    this.getAllCandidates$ = this.voteService.getAllCandidates();
    this.getAllPresidentCandidates$ = this.voteService.getAllPresidentCandidates();
    this.getAllVicePresidentCandidates$ = this.voteService.getAllVicePresidentCandidates();
    this.getAllSecretaryCandidates$ = this.voteService.getAllSecretaryCandidates();
    this.getAllTreasurerCandidates$ = this.voteService.getAllTreasurerCandidates();
    this.getAllAuditorCandidates$ = this.voteService.getAllAuditorCandidates();
    this.getAllCpeRepresentativeCandidates$ = this.voteService.getAllCpeRepresentativeCandidates();

    // Subscribe to observables and handle data
    this.highestVoteCounts$.subscribe();
    this.getAllCandidates$.subscribe();
    this.getAllPresidentCandidates$.subscribe();
    this.getAllVicePresidentCandidates$.subscribe();
    this.getAllSecretaryCandidates$.subscribe();
    this.getAllTreasurerCandidates$.subscribe();
    this.getAllAuditorCandidates$.subscribe();
    this.getAllCpeRepresentativeCandidates$.subscribe();
  }






}
