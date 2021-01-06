import { NgModule } from '@angular/core';
import { IconSuccessComponent } from '../components/icon-success/icon-success.component';
import { IconWarningComponent } from '../components/icon-warning/icon-warning.component';
import { IconInfoComponent } from '../components/icon-info/icon-info.component';
import { IconErrorComponent } from '../components/icon-error/icon-error.component';



@NgModule({
  declarations: [
    IconSuccessComponent,
    IconWarningComponent,
    IconInfoComponent,
    IconErrorComponent
  ],
  exports: [
    IconSuccessComponent,
    IconWarningComponent,
    IconInfoComponent,
    IconErrorComponent
  ]
})
export class IconsModule { }
