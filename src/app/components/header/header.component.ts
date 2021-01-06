import { AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
// import { AuthPopupComponent } from '../auth-popup/auth-popup.component';
import { LoginComponent } from '../../dialogs/login/login.component';
import { SignupFullComponent } from '../../dialogs/signup-full/signup-full.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterContentInit  {

  displayName!: string;

  constructor(
    public authService: AuthService,
    private dialog: MatDialog,
  ) { }
  
  ngOnInit(): void {

  }
  
  ngAfterContentInit(): void {
    document.addEventListener('click', (event) => {
      const dropdown = document.querySelector('.dropdown');

      if(!(event.target as HTMLElement).closest('.dropdown') && dropdown != null) {
        dropdown.classList.remove('open');
      }
    });
  }

  signup() {
    this.dialog.open(SignupFullComponent);
  }

  login() {
    this.dialog.open(LoginComponent);
  }

  toggleDropdown() {
    const dropdown = document.querySelector('.dropdown');
    dropdown?.classList.toggle('open');
  }

}
