import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { map, take, takeUntil, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';
import { SignupFullComponent } from '../signup-full/signup-full.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  get email() { return this.form.get('email') }
  get password() { return this.form.get('password') }

  form: FormGroup;

  errorMessage!: string;

  isLoading: boolean = false;

  constructor(
    public authService: AuthService, 
    public fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<LoginComponent>
  ) { 
    this.authService.user.pipe(
      map(user => !!user),
      takeUntil(this.dialogRef.beforeClosed())
    ).subscribe( (isLoggedIn) => {
      if(isLoggedIn) {
        this.isLoading = false;
        this.dialogRef.close({
          isLoggedIn: true
        });
      }
    });

    this.form = this.fb.group({
      'email': ['', [
        Validators.required,
        Validators.email
      ]],
      'password': ['', [
        Validators.required
      ]]
    });
  }

  ngOnInit(): void {
  }

  async submit() {
    if(this.form.valid) {
      this.isLoading = true;
      await this.authService.emailLogIn(this.email?.value, this.password?.value)
        .catch( (error) => {
          this.isLoading = false;
          this.password?.setValue('');
          this.form.reset(this.form.value);

          console.error('Error logging in: ', error);

          switch (error.code) {
            case 'auth/invalid-email':
              this.errorMessage = 'Invalid Email';
              console.error('Invalid email. Message: ', error.message)
              break;

            case 'auth/user-disabled':
              this.errorMessage = 'User Disabled';
              console.error('User disabled. Message: ', error.message)
              break;
            
            case 'auth/user-not-found':
              this.errorMessage = 'User Not Found';
              console.error('User not found. Message: ', error.message)
              break;

            case 'auth/wrong-password':
              this.errorMessage = 'Invalid Password';
              console.error('Wrong Password. Message: ', error.message)
              break;

            case 'auth/too-many-requests':
              this.errorMessage = 'Too many requests';
              console.error('Wrong Password. Message: ', error.message)
              break;
          
            default:

              break;
          }
        });
    }
  }

  googleLogIn() {
    this.authService.googleLogIn()
      .catch( (error) => {
        console.error('Error logging in: ', error);

        switch (error.code) {
          case 'auth/auth-domain-config-required':
            console.error('Domain config required. Message: ', error.message)
            break;

          case 'auth/operation-not-supported-in-this-environment':
            console.error('Operation not supported in this environment. Message: ', error.message)
            break;
          
          case 'auth/unauthorized-domain':
            console.error('Unauthorized domain. Message: ', error.message)
            break;
        
          default:

            break;
        }
      });
  }

  guestLogIn() {
    this.authService.guestLogIn()
      .catch( (error) => {
        console.error('Error logging in: ', error);

        switch (error.code) {
          case 'auth/operation-not-allowed':
            console.error('Operation not allowed. Message: ', error.message)
            break;
        
          default:

            break;
        }
      });
  }

  showResetDialog() {
    this.dialogRef.close();
    this.dialog.open(ResetPasswordComponent)
  }

  showSignupDialog() {
    this.dialogRef.close();
    this.dialog.open(SignupFullComponent)
  }

}
