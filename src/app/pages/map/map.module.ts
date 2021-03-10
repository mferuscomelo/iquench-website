import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapRoutingModule } from './map-routing.module';
import { MapComponent } from './map.component';

import { HeaderModule } from 'src/app/components/header/header.module';
import { MatComponentsModule } from 'src/app/modules/mat-components.module';
import { SharedModule } from 'src/app/modules/shared-module.module';

@NgModule({
  declarations: [MapComponent],
  imports: [
    CommonModule,
    MapRoutingModule,
    SharedModule
    // HeaderModule
  ]
})
export class MapModule { }
