import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import firebase from 'firebase/compat/app';
import { Candidate } from '../shared/models/Candidate';
import { Observable, catchError, forkJoin, from, map, mergeMap, of, switchMap, tap, throwError, toArray} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GET_ELECTION_STATUS_URL, GET_USER_VOTE_RESULT_URL, SET_ELECTION_URL, USER_COUNT_URL, USER_COUNT_VOTED_URL, USER_VOTE_RESULT_URL } from '../shared/apiURLs/URLs';
import { ToastrService } from 'ngx-toastr';
import { Election } from '../shared/models/Election';
import { UserVoteResult } from '../shared/models/UserVoteResult';

@Injectable({
  providedIn: 'root'
})
export class VoteService {

  customOrder = [
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


  constructor(private db: AngularFireDatabase, private http:HttpClient,  private toastrService: ToastrService) { }

  uploadCandidates(candidates: Candidate[]): Observable<any[]> {
    const candidateRefs: AngularFireList<Candidate> = this.db.list('candidates');
    const pushObservables: Observable<any>[] = [];

    // Iterate over each candidate
    candidates.forEach(candidate => {
      const candidateId = candidate.id; // Get the desired ID from candidate.id

      // Push the candidate object with the specified ID to Firebase
      pushObservables.push(from(candidateRefs.set(candidateId, candidate)));
    });

    // Return an observable that resolves when all candidates are uploaded
    return from(Promise.all(pushObservables));
  }
  
  submitUserVote( userVote :UserVoteResult ): Observable<UserVoteResult>{
    return this.http.post<UserVoteResult>(USER_VOTE_RESULT_URL, userVote).pipe(
      tap({
        next: (user) => {
          this.toastrService.success(
            `Vote Submitted`,
            'Success'
          )
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Failed');
        }
      })
    );
  }

  getUsersCount(): Observable<any>{
    return this.http.get<any>( USER_COUNT_URL );
  }

  setUsersCount(cmd: number): Observable<void> {
    return from(this.db.object(`users/all`).set(cmd));
  }

  setUsersFingerprintedIndex(cmd: number): Observable<void> {
    return from(this.db.object(`users/FingerprintIndex`).set(cmd));
  }

  getUsersWhoVoted(): Observable<any>{
    return this.http.get<any>(USER_COUNT_VOTED_URL);
  }

  setUsersWhoVoted(cmd: number): Observable<void> {
    return from(this.db.object(`users/voted`).set(cmd));
  }

  listenUsersCount(): Observable<any> {
    return this.db.object<number>(`users/all`).valueChanges();
  }

  listenUsersWhoVotedCount(): Observable<any> {
    return this.db.object<number>(`users/voted/`).valueChanges();
  }

  getUserVote(id: string): Observable<UserVoteResult>{
    return this.http.get<UserVoteResult>(GET_USER_VOTE_RESULT_URL+id);
  }

  setUserVote(cmd: number): Observable<void> {
    return from(this.db.object(`users/voted`).set(cmd));
  }

  setElectionStatus(isElectionStart: boolean): Observable<void>{
    return this.http.post<void>(SET_ELECTION_URL, {isElectionStart});
  }

  getAllCandidates(): Observable<any> {
    return this.db.list<any>('candidates').valueChanges();
  }

  getAllPresidentCandidates(): Observable<any[]> {
    return this.db.list<any>('candidates').valueChanges().pipe(
      map(candidates => {
        const filteredCandidates = candidates.filter(candidate => candidate.Position === 'PRESIDENT');
        filteredCandidates.sort((a, b) => b.Votes - a.Votes);
        return filteredCandidates;
      })
    );
  }
  getAllVicePresidentCandidates(): Observable<any[]> {
    return this.db.list<any>('candidates').valueChanges().pipe(
      map(candidates => {
        const filteredCandidates = candidates.filter(candidate => candidate.Position === 'VICE-PRESIDENT');
        filteredCandidates.sort((a, b) => b.Votes - a.Votes);
        return filteredCandidates;
      })
    );
  }

  getAllSecretaryCandidates(): Observable<any[]> {
    return this.db.list<any>('candidates').valueChanges().pipe(
      map(candidates => {
        const filteredCandidates = candidates.filter(candidate => candidate.Position === 'SECRETARY');
        filteredCandidates.sort((a, b) => b.Votes - a.Votes);
        return filteredCandidates;
      })
    );
  }

  getAllTreasurerCandidates(): Observable<any[]> {
    return this.db.list<any>('candidates').valueChanges().pipe(
      map(candidates => {
        const filteredCandidates = candidates.filter(candidate => candidate.Position === 'TREASURER');
        filteredCandidates.sort((a, b) => b.Votes - a.Votes);
        return filteredCandidates;
      })
    );
  }
  getAllAuditorCandidates(): Observable<any[]> {
    return this.db.list<any>('candidates').valueChanges().pipe(
      map(candidates => {
        const filteredCandidates = candidates.filter(candidate => candidate.Position === 'AUDITOR');
        filteredCandidates.sort((a, b) => b.Votes - a.Votes);
        return filteredCandidates;
      })
    );
  }

  getAllCpeRepresentativeCandidates(): Observable<any[]> {
    return this.db.list<any>('candidates').valueChanges().pipe(
      map(candidates => {
        const filteredCandidates = candidates.filter(candidate => candidate.Position === 'CPE REPRESENTATIVE');
        filteredCandidates.sort((a, b) => b.Votes - a.Votes);
        return filteredCandidates;
      })
    );
  }

  getElectionStatus(): Observable<Election> {
    return this.http.get<Election>(GET_ELECTION_STATUS_URL);
  }

  getHighestVoteCounts(): Observable<any[]> {
    return this.db.object('/candidates').valueChanges().pipe(
      map((candidates: any) => {
        const highestVoteCounts: { [key: string]: any } = {};

        // Iterate through each candidate
        for (const candidateId in candidates) {
          if (candidates.hasOwnProperty(candidateId)) {
            const candidate = candidates[candidateId];
            const position = candidate.Position;

            // Update highest vote count for the position
            if (!highestVoteCounts[position] || candidate.Votes > highestVoteCounts[position].Votes) {
              highestVoteCounts[position] = candidate;
            }
          }
        }

        // Convert highestVoteCounts object to array and sort by custom order
        const result = Object.keys(highestVoteCounts)
          .map(position => ({ position, ...highestVoteCounts[position] }))
          .sort((a, b) => {
            const indexA = this.customOrder.indexOf(a.position);
            const indexB = this.customOrder.indexOf(b.position);
            return indexA - indexB;
          });
        return result;
      })
    );
  }

  deleteAllCandidates(candidates: Candidate[]): Observable<any[]> {
    const candidateRefs: AngularFireList<any> = this.db.list('candidates');
    const pushObservables: Observable<any>[] = [];

    // Iterate over each candidate
    candidates.forEach(candidate => {
      const candidateId = candidate.id; // Get the desired ID from candidate.id

      // Push the candidate object with the specified ID to Firebase
      pushObservables.push(from(candidateRefs.set(candidateId, null)));
    });

    // Return an observable that resolves when all candidates are uploaded
    return from(Promise.all(pushObservables));
  }

  updateVoteCounts(candidateID: string): Observable<void> {
    return from(this.db.object(`candidates/${candidateID}`).update({ Votes: firebase.database.ServerValue.increment(1) }));
  }

}
