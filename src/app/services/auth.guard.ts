import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.user.pipe(
      take(1),
      map(user => !!user),
      tap( (loggedIn) => {
        if(!loggedIn) {
          console.error('Access denied');
        }
      })
    );
  }
  
}

// import { Injectable } from '@angular/core';
// import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
// import { Observable } from 'rxjs';
// import { AuthService } from './auth.service';
// import { take, map, tap } from 'rxjs/operators';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthGuard implements CanActivate {
//   constructor(private authService: AuthService, private router: Router) {}

//   canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
//     return this.authService.user.pipe(
//       take(1),
//       map(user => !!user), // <-- map to boolean
//       tap(loggedIn => {
//         if (!loggedIn) {
//           console.error('Access denied!');
//           this.router.navigate(['/login'], { queryParams: { continueUrl: encodeURI(state.url) } });
//         }
//       })
//     )
//   }
// }
