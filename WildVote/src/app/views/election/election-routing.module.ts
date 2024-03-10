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
        path: 'manage-candidates/:id',
        component: EditCandidateComponent,
        data: {
          title: 'Manage Candidate'
        }
      },
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
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ElectionRoutingModule { }
