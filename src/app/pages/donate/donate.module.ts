import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DonateRoutingModule } from './donate-routing.module';
import { DonateComponent } from './donate.component';
import { HeaderModule } from 'src/app/components/header/header.module';
import { FooterModule } from 'src/app/components/footer/footer.module';
import { MatComponentsModule } from 'src/app/modules/mat-components.module';
import { FaComponentsModule } from 'src/app/modules/fa-components.module';
import { SharedModule } from 'src/app/modules/shared-module.module';


@NgModule({
  declarations: [DonateComponent],
  imports: [
    CommonModule,
    DonateRoutingModule,
    // HeaderModule,
    // FooterModule,
    SharedModule
  ]
})
export class DonateModule { }
