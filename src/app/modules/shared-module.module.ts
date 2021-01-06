import { NgModule } from '@angular/core';
import { FaComponentsModule } from './fa-components.module';
import { MatComponentsModule } from './mat-components.module';



@NgModule({
  imports: [
    MatComponentsModule,
    FaComponentsModule
  ],
  exports: [
    MatComponentsModule,
    FaComponentsModule
  ]
})
export class SharedModule { }
