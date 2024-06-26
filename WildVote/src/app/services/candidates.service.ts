import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, tap } from 'rxjs';
import { Candidate } from '../shared/models/Candidate';
import { ADD_CANDIDATE_URL, EDIT_CANDIDATE_URL, GET_CANDIDATES_BY_ID_URL, GET_CANDIDATES_URL, REMOVE_CANDIDATE_URL } from '../shared/apiURLs/URLs';

@Injectable({
  providedIn: 'root'
})
export class CandidatesService {

  constructor(private http:HttpClient, private toastrService: ToastrService, private router: Router) { }

  addCandidate( id:string, Fullname:string, Department:string, PartyList:string, Position:string, Year:string, image: File, color: string ): Observable<Candidate>{
    const formData: FormData = new FormData();
    formData.append('profile', image);
    formData.append('id', id);
    formData.append('Fullname', Fullname);
    formData.append('Department', Department);
    formData.append('Year', Year);
    formData.append('PartyList', PartyList);
    formData.append('Position', Position);
    formData.append('color', color);
    return this.http.post<Candidate>(ADD_CANDIDATE_URL, formData).pipe(
      tap({
        next: (candidate) => {
          this.toastrService.success(
            `Candidate ${candidate.Fullname} Added`,
            'Success'
          )
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Error');
        }
      })
    );
  }
  
  deleteCandidateByID(id: string) {
    return this.http.delete(REMOVE_CANDIDATE_URL + id).pipe(
      tap({
        next: (user) => {
          this.toastrService.success(
            `Candidate Deleted`,
            'Success'
          )
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Error');
        }
      })
    );
  }

  editCandidate(id:string, PartyList:string, Position:string, image: File, Fullname: string, Department: string, Year: string, color: string): Observable<Candidate>{
    const candidateData: FormData = new FormData();
    candidateData.append('id', id);
    candidateData.append('PartyList', PartyList);
    candidateData.append('Position', Position);
    candidateData.append('Fullname', Fullname);
    candidateData.append('Department', Department);
    candidateData.append('Year', Year);
    candidateData.append('color', color);
    if(image){
      candidateData.append('profile', image);
    }
    return this.http.patch<Candidate>(EDIT_CANDIDATE_URL, candidateData).pipe(
      tap({
        next: (updatedCandidate) => {
          this.toastrService.success(
            `Candidate ${updatedCandidate.id} Updated`,
            'Success'
          )
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Error');
        }
      })
    );
  }

  getCandidates(): Observable<Candidate[]>{
    return this.http.get<Candidate[]>(GET_CANDIDATES_URL);
  }

  getCandidateByID( id :string ): Observable<Candidate>{
    return this.http.get<Candidate>(GET_CANDIDATES_BY_ID_URL+id);
  }


}
