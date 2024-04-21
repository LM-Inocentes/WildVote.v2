import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { Candidate } from '../shared/models/Candidate';
import { Observable, catchError, forkJoin, from, map, mergeMap, of, switchMap, throwError, toArray} from 'rxjs';
import firebase from 'firebase/compat/app';

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

  setElectionStatus(cmd: boolean): Observable<void> {
    // Get a reference to the 'election' node in your Firebase database
    const electionRef = this.db.object('election');

    // Set the isElectionStart value to true
    return from(electionRef.update({ isElectionStart: cmd }));
  }

  getAllCandidates(): Observable<any[]> {
    return this.db.list<any>('candidates').valueChanges();
  }

  getElectionStatus(): Observable<boolean> {
    // Get a reference to the 'election' node in your Firebase database
    const electionRef = this.db.object('election/isElectionStart');

    // Return an observable with type assertion using pipe and map operator
    return electionRef.valueChanges().pipe(
      map(value => !!value) // Map the value to boolean explicitly
    );
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
