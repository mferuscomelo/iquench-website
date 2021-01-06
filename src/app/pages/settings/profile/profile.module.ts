import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { FaComponentsModule } from 'src/app/modules/fa-components.module';
import { MatComponentsModule } from 'src/app/modules/mat-components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UpdateEmailModule } from 'src/app/dialogs/update-email/update-email.module';


@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FaComponentsModule,
    MatComponentsModule,
    UpdateEmailModule
  ]
})
export class ProfileModule { }
