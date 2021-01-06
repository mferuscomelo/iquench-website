import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnDestroy {

  private destroy = new Subject<void>();

  settingsForm!: FormGroup;
  
  get newFountainNotification() { return this.settingsForm.get('newFountainNotification') }
  get userFountainNotification() { return this.settingsForm.get('userFountainNotification') }
  get feedbackNotification() { return this.settingsForm.get('feedbackNotification') }

  canUpdate: boolean = false;
  isLoading: boolean = false;
  user!: User;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
  ) { 
    this.settingsForm = this.fb.group({
      'newFountainNotification': [true, [
        Validators.required,
      ]],
      'userFountainNotification': [true, [
        Validators.required,
      ]],
      'feedbackNotification': [true, [
        Validators.required,
      ]],
    });
  }

  ngOnInit(): void {
    this.getData();

    this.settingsForm.valueChanges.pipe(
      takeUntil(this.destroy)
    ).subscribe( () => {
      if(this.settingsForm.dirty){
        this.canUpdate = true;
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  getData() {
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
    const newFountainNotification = this.user.settings.newFountainNotification;
    const userFountainNotification = this.user.settings.userFountainNotification;
    const feedbackNotification = this.user.settings.feedbackNotification;

    this.newFountainNotification?.setValue(newFountainNotification);
    this.userFountainNotification?.setValue(userFountainNotification);
    this.feedbackNotification?.setValue(feedbackNotification);

    this.canUpdate = false;
  }

  submit() {
    if(this.settingsForm.valid && this.user) {
      this.user.settings.newFountainNotification = this.newFountainNotification?.value;
      this.user.settings.userFountainNotification = this.userFountainNotification?.value;
      this.user.settings.feedbackNotification = this.feedbackNotification?.value;
      this.authService.updateUserData(this.user)
        .then( () => {
          this.canUpdate = false;
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
