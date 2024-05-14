import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScanRoutingModule } from './scan-routing.module';
import { ScanComponent } from './scan.component';
import { ButtonModule, CardModule, FormModule, GridModule } from '@coreui/angular';
import { IconModule, IconSetService } from '@coreui/icons-angular';

@NgModule({
  declarations: [
    ScanComponent
  ],
  imports: [
    CommonModule,
    ScanRoutingModule, 
    CardModule,
    ButtonModule,
    GridModule,
    IconModule,
  ],
  providers:[
    IconSetService
  ],
})
export class ScanModule { }
