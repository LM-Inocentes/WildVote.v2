import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';
import { VotingSystemComponent } from './voting-system.component';

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

import { VotingSystemRoutingModule } from './voting-system-routing.module';


@NgModule({
  imports: [
    CommonModule,
    VotingSystemRoutingModule,
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
  declarations: [
    VotingSystemComponent
  ],
  providers:[
    IconSetService
  ]
})
export class VotingSystemModule { }
