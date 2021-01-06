import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IndexRoutingModule } from './index-routing.module';
import { IndexComponent } from './index.component';

import { FooterModule } from 'src/app/components/footer/footer.module';

import { HeaderModule } from 'src/app/components/header/header.module';
import { MatComponentsModule } from 'src/app/modules/mat-components.module';
import { FaComponentsModule } from 'src/app/modules/fa-components.module';

@NgModule({
  declarations: [
    IndexComponent
  ],
  imports: [
    CommonModule,
    IndexRoutingModule,
    // HeaderModule,
    // FooterModule,
    FaComponentsModule,
    MatComponentsModule
  ],
  exports: [
    IndexComponent
  ]
})
export class IndexModule { }
