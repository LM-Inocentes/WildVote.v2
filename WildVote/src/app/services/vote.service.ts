import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { Candidate } from '../shared/models/Candidate';
import { Observable, catchError, forkJoin, from, map, switchMap} from 'rxjs';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class VoteService {

  constructor(private db: AngularFireDatabase) { }

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

  updateVoteCounts(candidateID: string): Observable<void> {
    return from(this.db.object(`candidates/${candidateID}`).update({ Votes: firebase.database.ServerValue.increment(1) }));
  }

}
