import { Injectable, OnDestroy } from '@angular/core';

import { AngularFireAnalytics } from '@angular/fire/analytics'
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import 'firebase/auth';
import { Observable, of, Subject } from 'rxjs';
import { map, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../interfaces/user';
import { FirestoreService } from './firestore.service';

// declare var google: any

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {

  private destroy = new Subject<void>();

  user!: Observable<User | null>;

  constructor(
    private analytics: AngularFireAnalytics,
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private firestoreService: FirestoreService,
    private router: Router
  ) {
    this.auth.useDeviceLanguage();

    this.user = this.auth.authState.pipe(
      takeUntil(this.destroy),
      switchMap( (user) => {
        if(user) {
          return (this.firestore.collection('users').doc(user.uid).valueChanges() as Observable<User>)
        } else {
          return of(null);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  // START SIGN UP METHODS

  async emailSignUp(email: string, password: string, displayName: string) {
    return this.auth.createUserWithEmailAndPassword(email, password)
      .then( (result) => {
        this.analytics.logEvent('signed_up', { method: 'email' });

        if(result.user) {
          result.user
            .updateProfile({
              displayName: displayName
            })
            .then( async () => {
              if(result.user) {
                const user = await this.createUserFromFirebaseUser(result.user)
                this.updateUserData(user)
                  .then( () => {
                    this.sendEmailVerification();
                  })
              }
            })
        }
      })
  }

  async linkSignUp(email: string) {
    const actionCodeSettings = {
      url: environment.actionCodeUrl + '/dashboard', 
      handleCodeInApp: true,
    };

    return this.auth.sendSignInLinkToEmail(email, actionCodeSettings)
      .then( () => {
        this.analytics.logEvent('signed_up', { method: 'link' });
        window.localStorage.setItem('emailForSignIn', email);
      })
  }

  // END SIGN UP METHODS

  // START LOG IN METHODS

  async oneTapLogIn(credential: string) {
    return this.auth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(credential))
      .then( async (credential) => {
        this.analytics.logEvent('logged_in', { method: 'onetap' });

        const firebaseUser = credential.user
        if(firebaseUser) {
          const user = await this.createUserFromFirebaseUser(firebaseUser);
          this.updateUserData(user);
        }
      });
  }

  async emailLogIn(email: string, password: string) {
    // TODO: Check if email and password are valid
    return this.auth.signInWithEmailAndPassword(email, password)
      .then( async (credential) => {
        this.analytics.logEvent('logged_in', { method: 'email' });

        const firebaseUser = credential.user;
        if(firebaseUser) {
          const user = await this.createUserFromFirebaseUser(firebaseUser);
          this.updateUserData(user);
          
          if(!firebaseUser.emailVerified) {
            this.sendEmailVerification();
          }
        }
      });
  }

  async googleLogIn() {
    const provider = new firebase.auth.GoogleAuthProvider();

    return this.auth.signInWithRedirect(provider)
      .then( () => {
        this.auth.getRedirectResult()
          .then( async (credential) => {
            this.analytics.logEvent('logged_in', { method: 'google' });

            const firebaseUser = credential.user
            if(firebaseUser) {
              const user = await this.createUserFromFirebaseUser(firebaseUser);
              this.updateUserData(user);
            }
          })
          .catch( (error) => {
            console.error('Google Log In Error');
          });
      });
  }

  async linkLogIn(email: string, emailLink: string) {
    return this.auth.signInWithEmailLink(email, emailLink)
      .then( async (credential) => {
        this.analytics.logEvent('logged_in', { method: 'link' });

        const firebaseUser = credential.user;
        if(firebaseUser) {
          const user = await this.createUserFromFirebaseUser(firebaseUser);
          this.updateUserData(user);
        }
      })
  }

  // END LOG IN METHODS

  // START REAUTH METHODS

  async emailReauth(email: string, password: string) {
    const credential = firebase.auth.EmailAuthProvider.credential(email, password);
    return this.auth.currentUser
      .then( (firebaseUser) => {
        if(firebaseUser)
          return firebaseUser.reauthenticateWithCredential(credential);
        else
          return null;
      });
  }

  // END REAUTH METHODS

  // START CUSTOM HANDLER

  async handleVerifyEmail(actionCode: string) {
    return this.auth.applyActionCode(actionCode);
  }

  async verifyPasswordResetCode(actionCode: string) {
    return this.auth.verifyPasswordResetCode(actionCode);
  }

  async handleRecoverEmail(actionCode: string) {
    return this.auth.checkActionCode(actionCode)
      .then( (info) => {
        const restoredEmail = info.data.email;
        const previousEmail = info.data.previousEmail;

        if(restoredEmail && previousEmail) {
          this.firestoreService.updateField('users', { fieldName: 'email', value: previousEmail }, 'email', restoredEmail);
          this.auth.applyActionCode(actionCode);
        }
      })
  }

  async handleLinkSignIn() {
    const url = this.router.url;

    if(await this.auth.isSignInWithEmailLink(url)) {
      let email = window.localStorage.getItem('emailForSignIn');

      if(!email) {
        email = window.prompt('Please provide your email for confirmation');
      }

      if(email) {
        return this.linkLogIn(email, url)
          .then( () => {
            return window.localStorage.removeItem('emailForSignIn');
          })
      }
    }
  }

  // END CUSTOM HANDLER

  // START HELPER FUNCTIONS

  async updateUserData(user: User) {
    const promises = [];

    const currentUser = this.getCurrentUser();
    if(currentUser) {
      // Update Email
      if(user.email && user.email != currentUser.email) {
        promises.push(
          currentUser.updateEmail(user.email)
        );
      }
      
      // Update Display Name
      if(user.displayName && user.displayName != currentUser.displayName) 
        promises.push(
          currentUser.updateProfile({displayName: user.displayName})
        );
  
      // Update User DB
      promises.push(
        this.firestore
          .collection('users')
          .doc(user.uid)
          .set(user, { merge: true })
      );
  
      // Update Public User DB
      const publicUserDBRef = this.firestore.collection('public-users').doc(user.uid);
      if(user.displayName && !user.settings.isPrivate) {
        promises.push(
          publicUserDBRef
            .set(
              { uid: user.uid, displayName: user.displayName }, 
              { merge: true }
            )
        )
      } else {
        promises.push(
          publicUserDBRef
            .delete()
        )
      }
    }

    return Promise.all(promises)
  }

  async createUserFromFirebaseUser(firebaseUser: firebase.User): Promise<User> {
    return this.user.pipe(
      take(1),
      map( (currentUser) => {
        if(currentUser)
          return currentUser;

        const user: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          settings: {
            language: 'English',
            isPrivate: false,
            newFountainNotification: true,
            userFountainNotification: true,
            feedbackNotification: true,
            units: 'Metric'
          }
        }
        
        return user;
      })
    ).toPromise()
  } 
  
  getCurrentUser(): firebase.User | null {
    return firebase.auth().currentUser;
  }

  async sendEmailVerification() {
    const actionCodeSettings = {
      url: environment.actionCodeUrl + '/dashboard',
      handleCodeInApp: true,
    };

    const currentUser = this.getCurrentUser();
    return currentUser?.sendEmailVerification(actionCodeSettings)
      .catch( (error) => {
        console.error('Error sending verification email: ', error);
      })
  }

  async sendPasswordResetEmail(email: string) {
    return this.auth.sendPasswordResetEmail(email)
      .then( () => {
        console.log('Password reset email sent!');
      });
  }

  async logOut() {
    this.analytics.logEvent('logged_out');
    // google.accounts.id.disableAutoSelect();
    this.auth.signOut();
    return this.router.navigate(['/']);
  }

  initGoogleOneTap() {
    // TODO: implement Google OneTap
    // const domain = window.location.hostname;
    // google.accounts.id.initialize({
    //   client_id: environment.GOOGLE_OAUTH_CLIENT_KEY,
    //   cancel_on_tap_outside: false,
    //   auto_select: true,
    //   state_cookie_domain: domain,
    //   callback: (response: any) => {
    //     this.oneTapLogIn(response.credential)
    //       .catch( (error) => {
    //         console.error('Error logging in with Google One Tap: ', error);
    //       });
    //   },
    // });

    // google.accounts.id.prompt( (notification: any) => {
    //   if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
    //     // try next provider if OneTap is not displayed or skipped
    //   }
    // });
  }

  // END HELPER FUNCTIONS

}
