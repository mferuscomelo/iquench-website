import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { map, take } from 'rxjs/operators';
import { PopupData } from 'src/app/interfaces/popup-data';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { DialogComponent } from '../dialog/dialog.component';
import { ReauthComponent } from '../reauth/reauth.component';

@Component({
  selector: 'app-update-email',
  templateUrl: './update-email.component.html',
  styleUrls: ['./update-email.component.scss']
})
export class UpdateEmailComponent implements OnInit {

  get email() { return this.form.get('email') }
  
  form: FormGroup;
  
  errorMessage!: string;
  isLoading: boolean = false;

  constructor(
    public authService: AuthService, 
    public fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<UpdateEmailComponent>
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
      this.isLoading = true;

      this.authService.user.pipe(
        take(1)
      ).subscribe( (user) => {
        if(user && this.email) {
          const updatedUser: User = {
            ...user,
            email: this.email.value
          }

          this.authService.updateUserData(updatedUser)
            .then( () => {
              this.isLoading = false;
              this.dialogRef.close();

              const data: PopupData = {
                icon: 'success',
                title: 'Almost there!',
                text: `We've sent you an email with a link to confirm the email change.`,
                confirmButtonText: 'Continue'
              }
              this.dialog.open(DialogComponent, { data })
            })
            .catch( (error) => {
              this.isLoading = false;
              // this.errorMessage = error.message;

              switch (error.code) {
                case 'auth/requires-recent-login':
                  this.dialog
                    .open(ReauthComponent)
                    .afterClosed()
                    .pipe(
                      take(1)
                    )
                    .subscribe( () => {
                      this.submit();
                    });
                  break;

                case 'auth/email-already-in-use':
                  this.errorMessage = 'Email already in use'
                  break;

                case 'auth/invalid-email':
                  this.errorMessage = 'Invalid email'
                  break;
              
                default:
                  this.errorMessage = 'Something went wrong'
                  break;
              }
            })
        }
      })
    }
  }

}
