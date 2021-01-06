import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { RouterModule } from '@angular/router';

import { MatComponentsModule } from 'src/app/modules/mat-components.module';
import { FaComponentsModule } from 'src/app/modules/fa-components.module';

@NgModule({
  declarations: [HeaderComponent],
  imports: [
    CommonModule,
    RouterModule,
    FaComponentsModule,
    MatComponentsModule
  ],
  exports: [HeaderComponent]
})
export class HeaderModule { }
