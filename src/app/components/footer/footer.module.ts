import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FooterComponent } from './footer.component';

import { RouterModule } from '@angular/router';
import { MatComponentsModule } from 'src/app/modules/mat-components.module';
import { FaComponentsModule } from 'src/app/modules/fa-components.module';

@NgModule({
  declarations: [FooterComponent],
  imports: [
    CommonModule,
    RouterModule,
    FaComponentsModule,
    FormsModule,
    MatComponentsModule
  ],
  exports: [FooterComponent]
})
export class FooterModule { }
