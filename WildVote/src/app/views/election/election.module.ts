import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';

import { ButtonModule, CardModule, FormModule, GridModule } from '@coreui/angular';
import { IconModule, IconSetService } from '@coreui/icons-angular';

import { ElectionRoutingModule } from './election-routing.module';

import { AddCandidateComponent } from './add-candidate/add-candidate.component'

@NgModule({
  declarations: [
    AddCandidateComponent
  ],
  imports: [
    CommonModule,
    ElectionRoutingModule,
    CardModule,
    ButtonModule,
    GridModule,
    IconModule,
    FormModule,
    ReactiveFormsModule,
  ],
  providers:[
    IconSetService
  ]
})
export class ElectionModule { }
