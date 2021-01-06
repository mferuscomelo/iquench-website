import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsermgmtRoutingModule } from './usermgmt-routing.module';
import { UsermgmtComponent } from './usermgmt.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FaComponentsModule } from 'src/app/modules/fa-components.module';
import { MatComponentsModule } from 'src/app/modules/mat-components.module';


@NgModule({
  declarations: [UsermgmtComponent],
  imports: [
    CommonModule,
    UsermgmtRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FaComponentsModule,
    MatComponentsModule,
  ]
})
export class UsermgmtModule { }
