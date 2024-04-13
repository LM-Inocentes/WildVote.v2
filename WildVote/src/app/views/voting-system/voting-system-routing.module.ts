import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VotingSystemComponent } from './voting-system.component';

const routes: Routes = [ 
  {
  path: '',
  component: VotingSystemComponent,
  data: {
    title: `Vote`
  }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VotingSystemRoutingModule { }
