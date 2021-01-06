import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsermgmtComponent } from './usermgmt.component';

const routes: Routes = [{ path: '', component: UsermgmtComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsermgmtRoutingModule { }
