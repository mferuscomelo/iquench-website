import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { IndexComponent } from './pages/index/index.component';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  { path: '', component: IndexComponent, pathMatch: 'full' },
  { path: 'about', loadChildren: () => import('./pages/about/about.module').then(m => m.AboutModule) },
  { path: 'donate', loadChildren: () => import('./pages/donate/donate.module').then(m => m.DonateModule) },
  { path: 'privacy', loadChildren: () => import('./pages/privacy/privacy.module').then(m => m.PrivacyModule) },
  { path: 'leaderboard', loadChildren: () => import('./pages/leaderboard/leaderboard.module').then(m => m.LeaderboardModule) },
  { path: 'map', loadChildren: () => import('./pages/map/map.module').then(m => m.MapModule) },
  { path: 'usermgmt', loadChildren: () => import('./pages/usermgmt/usermgmt.module').then(m => m.UsermgmtModule) },

  // { path: 'login', loadChildren: () => import('./components/login/login.module').then(m => m.LoginModule) },
  // { path: 'signup', loadChildren: () => import('./components/signup-full/signup-full.module').then(m => m.SignupFullModule) },
  
  { 
    path: 'dashboard', 
    loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard]
  },
  { 
    path: 'settings', 
    loadChildren: () => import('./pages/settings/settings.module').then(m => m.SettingsModule),
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules,
    initialNavigation: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
