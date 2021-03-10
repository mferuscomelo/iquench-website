import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateLocationRoutingModule } from './create-location-routing.module';
import { CreateLocationComponent } from './create-location.component';
import { SharedModule } from 'src/app/modules/shared-module.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'src/app/dialogs/dialog/dialog.module';
import { SignupLinkModule } from 'src/app/dialogs/signup-link/signup-link.module';


@NgModule({
  declarations: [CreateLocationComponent],
  imports: [
    CommonModule,
    CreateLocationRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    SignupLinkModule
  ]
})
export class CreateLocationModule { }
