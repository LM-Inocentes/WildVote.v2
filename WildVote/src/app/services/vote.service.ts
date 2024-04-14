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

  setElectionStatus(cmd: boolean): Observable<void> {
    // Get a reference to the 'election' node in your Firebase database
    const electionRef = this.db.object('election');

    // Set the isElectionStart value to true
    return from(electionRef.update({ isElectionStart: cmd }));
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

        const highestVoteCounts: { [key: string]: { Department: string, Votes: number; Fullname: string, 
          PartyList: string, Position: string, Profile: string, ProfileID: string, Year: string } } = {};

        // Iterate through each candidate
        for (const candidateId in candidates) {
          if (candidates.hasOwnProperty(candidateId)) {
            const candidate = candidates[candidateId];
            const position = candidate.Position;

            // Check if position exists in highestVoteCounts object
            if (!highestVoteCounts[position]) {
              highestVoteCounts[position] = { Votes: 0, Fullname: '', Department: '', PartyList: '', Position: '', Profile: '', ProfileID: '', Year: ''};
            }

            // Update highest vote count for the position
            if (candidate.Votes > highestVoteCounts[position].Votes) {
              highestVoteCounts[position] = {
                Votes: candidate.Votes,
                Fullname: candidate.Fullname,
                Department: candidate.Department, 
                PartyList: candidate.PartyList, 
                Position: candidate.Position, 
                Profile: candidate.Profile, 
                ProfileID: candidate.ProfileID, 
                Year: candidate.Year
              };
            }
          }
        }

        // Convert highestVoteCounts object to array for easier iteration in template
        const result = [];
        for (const position in highestVoteCounts) {
          if (highestVoteCounts.hasOwnProperty(position)) {
            result.push({ position, ...highestVoteCounts[position] });
          }
        }

        return result;
      })
    );
  }

  updateVoteCounts(candidateID: string): Observable<void> {
    return from(this.db.object(`candidates/${candidateID}`).update({ Votes: firebase.database.ServerValue.increment(1) }));
  }

}
