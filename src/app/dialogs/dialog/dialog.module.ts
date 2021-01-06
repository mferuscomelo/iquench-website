import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogComponent } from './dialog.component';
import { IconErrorComponent } from 'src/app/components/icon-error/icon-error.component';
import { IconInfoComponent } from 'src/app/components/icon-info/icon-info.component';
import { IconSuccessComponent } from 'src/app/components/icon-success/icon-success.component';
import { IconWarningComponent } from 'src/app/components/icon-warning/icon-warning.component';
import { MatComponentsModule } from 'src/app/modules/mat-components.module';
import { FaComponentsModule } from 'src/app/modules/fa-components.module';
import { FormsModule } from '@angular/forms';
import { IconsModule } from 'src/app/modules/icons.module';
import { SharedModule } from 'src/app/modules/shared-module.module';



@NgModule({
  declarations: [
    DialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    IconsModule
  ],
  exports: [
    DialogComponent
  ]
})
export class DialogModule { }
