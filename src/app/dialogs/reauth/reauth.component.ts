import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-reauth',
  templateUrl: './reauth.component.html',
  styleUrls: ['./reauth.component.scss']
})
export class ReauthComponent implements OnInit {

  get email() { return this.form.get('email') }
  get password() { return this.form.get('password') }

  form: FormGroup;

  errorMessage!: string;

  isLoading: boolean = false;

  constructor(
    public authService: AuthService, 
    public fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ReauthComponent>
  ) { 
    this.form = this.fb.group({
      'email': ['', [
        Validators.required,
        Validators.email
      ]],
      'password': ['', [
        Validators.required
      ]]
    });

    this.authService.user.pipe(
      take(1)
    ).subscribe( (user) => {
      if(user) {
        this.email?.setValue(user.email);
      }
    });
  }

  ngOnInit(): void {
  }

  submit() {
    if(this.form.valid) {
      this.isLoading = true;

      this.authService.emailReauth(this.email?.value, this.password?.value)
        .then( () => {
          this.isLoading = false;
          this.dialogRef.close();
        })
        .catch( (error) => {
          this.isLoading = false;
          
          switch (error.code) {
            case 'auth/user-mismatch':
              console.error('User mismatch');
              break;

            case 'auth/user-not-found':
              console.error('User not found');
              break;

            case 'auth/invalid-credential':
              console.error('Invalid credential');
              break;

            case 'auth/invalid-email':
              this.errorMessage = 'Invalid Email'
              break;

            case 'auth/wrong-password':
              this.errorMessage = 'Wrong Password'
              break;
          
            default:
              this.errorMessage = 'Something went wrong'
              break;
          }
        })
    }
  }

}
