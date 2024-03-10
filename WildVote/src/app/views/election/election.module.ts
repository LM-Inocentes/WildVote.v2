import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';

import {
  AvatarModule,
  ButtonGroupModule,
  ButtonModule,
  CardModule,
  FormModule,
  GridModule,
  NavModule,
  ProgressModule,
  TableModule,
  TabsModule,
  ModalModule,
  WidgetModule,
} from '@coreui/angular';

import { IconModule, IconSetService } from '@coreui/icons-angular';

import { ElectionRoutingModule } from './election-routing.module';

import { AddCandidateComponent } from './add-candidate/add-candidate.component'
import { ManageCandidateComponent } from './manage-candidate/manage-candidate.component';
import { EditCandidateComponent } from './edit-candidate/edit-candidate.component';

@NgModule({
  declarations: [
    AddCandidateComponent, ManageCandidateComponent, EditCandidateComponent
  ],
  imports: [
    CommonModule,
    ElectionRoutingModule,
    CardModule,
    ButtonModule,
    GridModule,
    ModalModule,
    IconModule,
    FormModule,
    ReactiveFormsModule,
    AvatarModule,
    ButtonGroupModule,
    NavModule,
    ProgressModule,
    TableModule,
    TabsModule,
    WidgetModule
  ],
  providers:[
    IconSetService
  ]
})
export class ElectionModule { }
