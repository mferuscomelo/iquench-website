import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { pairwise, switchMap, take, takeUntil } from 'rxjs/operators';
import { UpdateEmailComponent } from 'src/app/dialogs/update-email/update-email.component';
import { User } from 'src/app/interfaces/user';
import { UserSettings } from 'src/app/interfaces/user-settings';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

  private destroy = new Subject<void>();

  settingsForm: FormGroup;
  
  get language() { return this.settingsForm.get('language') }
  get units() { return this.settingsForm.get('units') }
  get isPrivate() { return this.settingsForm.get('isPrivate') }
  get displayName() { return this.settingsForm.get('displayName') }
  get email() { return this.settingsForm.get('email') }

  isLoading: boolean = false;
  user!: User;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private dialog: MatDialog
  ) {
    this.settingsForm = this.fb.group({
      'language': ['English', [
        Validators.required
      ]],
      'units': ['Metric', [
        Validators.required
      ]],
      'isPrivate': [false, [
        Validators.required,
      ]],
      'displayName': ['', [
        Validators.required,
        Validators.pattern('^(?=.* [a-zA-Z]).+'),
        Validators.minLength(5)
      ]],
      'email': [{value: '', disabled: true}],
      'password': [{value: 'N1ce Try :)', disabled: true}]
    });
  }

  ngOnInit(): void {
    this.getData();
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  getData() {
    console.log('Getting data...');
    this.authService.user.pipe(
      take(1)
    ).subscribe( (user) => {
      if(user) {
        this.user = user;
        this.setData();
      }
    });
  }

  setData() {
    const language = this.user.settings.language;
    const units = this.user.settings.units;
    const isPrivate = this.user.settings.isPrivate;
    const displayName = this.user.displayName;
    const email = this.user.email;

    if(displayName && email) {
      this.language?.setValue(language);
      this.units?.setValue(units);
      this.isPrivate?.setValue(isPrivate);
      this.displayName?.setValue(displayName);
      this.email?.setValue(email);
    }
  }

  openUpdateEmailDialog() {
    this.dialog.open(UpdateEmailComponent)
      // .afterClosed()
      // .pipe(
      //   take(1)
      // )
      // .subscribe( () => {
      //   this.getData();
      // })
  }

  openUpdatePasswordDialog() {
    
  }

  submit() {
    this.isLoading = true;
    if(this.settingsForm.valid && this.user) {
      this.user.displayName = this.displayName?.value;
      this.user.settings.language = this.language?.value;
      this.user.settings.units = this.units?.value;
      this.user.settings.isPrivate = this.isPrivate?.value;
      
      this.authService.updateUserData(this.user)
        .then( () => {
          this.isLoading = false;
          this.getData();
          // this.settingsForm.reset(this.settingsForm.value);
          // this.settingsForm.markAsPristine();
          // this.settingsForm.markAsUntouched();
        })
        .catch( (error) => {
          // TODO: need to implement catch error
          console.error('Error updating user: ', error)
          this.isLoading = false;
          // this.errorMessage = error.message;

          // switch (error.code) {
          //   case 'auth/requires-recent-login':
          //     this.dialog.open(ReauthComponent);
          //     break;

          //   case 'auth/email-already-in-use':
          //     this.errorMessage = 'Email already in use'
          //     break;

          //   case 'auth/invalid-email':
          //     this.errorMessage = 'Invalid email'
          //     break;
          
          //   default:
          //     this.errorMessage = 'Something went wrong'
          //     break;
          // }
        })
    }
  }

}
