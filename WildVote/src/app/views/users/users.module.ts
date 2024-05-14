
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
} from '@coreui/angular';

import { IconModule } from '@coreui/icons-angular';
import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { RegisterComponent } from './register/register.component';
import { EditComponent } from './edit/edit.component'

@NgModule({
  imports: [
    CommonModule,
    UsersRoutingModule,
    CardModule,
    NavModule,
    IconModule,
    TabsModule,
    GridModule,
    ProgressModule,
    ReactiveFormsModule,
    ButtonModule,
    FormModule,
    ButtonGroupModule,
    AvatarModule,
    TableModule,
    ModalModule,
  ],
  declarations: [UsersComponent, RegisterComponent, EditComponent],
})
export class UsersModule { }
