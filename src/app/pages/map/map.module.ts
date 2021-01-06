import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapRoutingModule } from './map-routing.module';
import { MapComponent } from './map.component';

import { HeaderModule } from 'src/app/components/header/header.module';
import { MatComponentsModule } from 'src/app/modules/mat-components.module';

@NgModule({
  declarations: [MapComponent],
  imports: [
    CommonModule,
    MapRoutingModule,
    MatComponentsModule,
    // HeaderModule
  ]
})
export class MapModule { }
