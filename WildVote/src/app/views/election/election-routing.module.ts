import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AddCandidateComponent } from './add-candidate/add-candidate.component'

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Election'
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'list-candidates'
      },
      {
        path: 'add-candidate',
        component: AddCandidateComponent,
        data: {
          title: 'Add Candidate'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ElectionRoutingModule { }
