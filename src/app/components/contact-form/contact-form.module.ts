import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { ContactFormComponent } from './contact-form.component';
import { IconErrorComponent } from '../icon-error/icon-error.component';
import { IconSuccessComponent } from '../icon-success/icon-success.component';

import { MatComponentsModule } from 'src/app/modules/mat-components.module';
import { FaComponentsModule } from 'src/app/modules/fa-components.module';
import { IconsModule } from 'src/app/modules/icons.module';

@NgModule({
  declarations: [
    ContactFormComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FaComponentsModule,
    MatComponentsModule,
    IconsModule
  ],
  exports: [
    ContactFormComponent
  ],
})
export class ContactFormModule { }
