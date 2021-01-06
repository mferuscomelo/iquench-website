import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReauthComponent } from './reauth.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FaComponentsModule } from 'src/app/modules/fa-components.module';
import { MatComponentsModule } from 'src/app/modules/mat-components.module';



@NgModule({
  declarations: [ReauthComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FaComponentsModule,
    MatComponentsModule
  ]
})
export class ReauthModule { }
