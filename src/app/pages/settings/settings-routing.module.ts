import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsComponent } from './settings.component';

const routes: Routes = [
  { 
    path: '', 
    component: SettingsComponent,
    children: [
      { path: '', redirectTo: 'profile' },
      { path: 'profile', loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule) },
      { path: 'notifications', loadChildren: () => import('./notifications/notifications.module').then(m => m.NotificationsModule) }
    ]
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
