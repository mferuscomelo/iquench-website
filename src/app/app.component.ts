import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  showHeader = true;
  showFooter = true;
  isTransparent = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.router.events
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          if(event.url == '/map') {
            this.showFooter = false;
          }
          if(event.url == '/') {
            this.isTransparent = true;
          }
        }
      });

    this.authService.initGoogleOneTap();
  }
}
