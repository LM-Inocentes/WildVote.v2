import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, tap } from 'rxjs';
import { Candidate } from '../shared/models/Candidate';
import { ADD_CANDIDATE_URL } from '../shared/apiURLs/URLs';

@Injectable({
  providedIn: 'root'
})
export class CandidatesService {

  constructor(private http:HttpClient, private toastrService: ToastrService, private router: Router) { }

  addCandidate( id:string, Fullname:string, Department:string, PartyList:string, Position:string, Year:string, image: File ): Observable<Candidate>{
    const formData: FormData = new FormData();
    formData.append('profile', image);
    formData.append('id', id);
    formData.append('Fullname', Fullname);
    formData.append('Department', Department);
    formData.append('Year', Year);
    formData.append('PartyList', PartyList);
    formData.append('Position', Position);
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
}
