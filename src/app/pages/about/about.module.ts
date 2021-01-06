import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactFormModule } from 'src/app/components/contact-form/contact-form.module';
import { AboutRoutingModule } from './about-routing.module';
import { AboutComponent } from './about.component';
import { FooterModule } from 'src/app/components/footer/footer.module';

import { HeaderModule } from 'src/app/components/header/header.module';
import { MatComponentsModule } from 'src/app/modules/mat-components.module';
import { FaComponentsModule } from 'src/app/modules/fa-components.module';

@NgModule({
  declarations: [AboutComponent],
  imports: [
    CommonModule,
    AboutRoutingModule,
    // HeaderModule,
    // FooterModule,
    ContactFormModule,
    FaComponentsModule,
    MatComponentsModule
  ]
})
export class AboutModule { }
