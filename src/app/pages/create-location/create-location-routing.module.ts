import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateLocationComponent } from './create-location.component';

const routes: Routes = [{ path: '', component: CreateLocationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateLocationRoutingModule { }
