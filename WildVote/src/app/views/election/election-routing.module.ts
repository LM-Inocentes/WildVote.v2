import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AddCandidateComponent } from './add-candidate/add-candidate.component'
import { ManageCandidateComponent } from './manage-candidate/manage-candidate.component'
import { EditCandidateComponent } from './edit-candidate/edit-candidate.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Election'
    },
    children: [
      {
        path: 'add-candidate',
        component: AddCandidateComponent,
        data: {
          title: 'Add Candidate'
        }
      },
      {
        path: 'manage-candidates',
        component: ManageCandidateComponent,
        data: {
          title: 'Manage Candidate'
        }
      },
      {
        path: 'manage-candidates/edit/:candidateID',
        component: EditCandidateComponent,
        data: {
          title: 'Edit Candidate'
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
