import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-signup-full',
  templateUrl: './signup-full.component.html',
  styleUrls: ['./signup-full.component.scss']
})
export class SignupFullComponent implements OnInit {

  get name() { return this.form.get('name') }
  get email() { return this.form.get('email') }
  get password() { return this.form.get('password') }

  form: FormGroup;

  errorMessage!: string;

  isLoading: boolean = false;

  constructor(
    public authService: AuthService, 
    public fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<SignupFullComponent>
  ) { 
    this.form = this.fb.group({
      'name': ['', [
        Validators.required,
        Validators.pattern('^(?=.* [a-zA-Z]).+'),
        Validators.minLength(5)
      ]],
      'email': ['', [
        Validators.required,
        Validators.email
      ]],
      'password': ['', [
        Validators.required,
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).+'),
        Validators.minLength(8)
      ]]
    });
  }

  ngOnInit(): void {

  }

  submit(): void {
    if(this.form.valid) {
      this.authService.emailSignUp(this.email?.value, this.password?.value, this.name?.value)
        .then( () => {
          this.dialogRef.close();
        })
        .catch( (error) => {
          this.password?.setValue('');
          this.form.reset(this.form.value);

          console.error('Error logging in: ', error);

          switch (error.code) {
            case 'auth/email-already-in-use':
              this.errorMessage = "Email adress already in use";
              console.error('Invalid email. Message: ', error.message)
              break;

            case 'auth/invalid-email':
              this.errorMessage = "Invalid Email";
              console.error('User disabled. Message: ', error.message)
              break;
            
            case 'auth/weak-password':
              this.errorMessage = "Weak Password";
              console.error('User not found. Message: ', error.message)
              break;
          
            default:

              break;
          }
        })
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

  showLoginDialog() {
    this.dialogRef.close();
    this.dialog.open(LoginComponent)
  }

}
