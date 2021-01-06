import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  get email() { return this.form.get('email') }

  form: FormGroup;

  errorMessage!: string;

  isLoading: boolean = false;

  constructor(
    public authService: AuthService, 
    public fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ResetPasswordComponent>
  ) { 
    this.form = this.fb.group({
      'email': ['', [
        Validators.required,
        Validators.email
      ]]
    });
  }

  ngOnInit(): void {

  }

  submit(): void {
    if(this.form.valid) {
      this.authService.sendPasswordResetEmail(this.email?.value)
        .then( () => {
          this.dialogRef.close();
        })
        .catch( (error) => {
          this.form.reset(this.form.value);

          console.error('Error logging in: ', error);

          switch (error.code) {
            case 'auth/invalid-email':
              console.error('Invalid email. Message: ', error.message)
              break;
            
            case 'auth/user-not-found':
              console.error('User not found. Message: ', error.message)
              break;
          
            default:

              break;
          }
        })
    }
  }

  showLoginDialog() {
    this.dialogRef.close();
    this.dialog.open(LoginComponent);
  }
}
