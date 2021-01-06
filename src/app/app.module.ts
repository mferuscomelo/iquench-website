import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from 'src/environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './services/auth.service';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FooterModule } from './components/footer/footer.module';
import { HeaderModule } from './components/header/header.module';
import { MatComponentsModule } from './modules/mat-components.module';
import { FaComponentsModule } from './modules/fa-components.module';
import { DialogModule } from './dialogs/dialog/dialog.module';
import { LoginModule } from './dialogs/login/login.module';
import { ReauthModule } from './dialogs/reauth/reauth.module';
import { ResetPasswordModule } from './dialogs/reset-password/reset-password.module';
import { SignupFullModule } from './dialogs/signup-full/signup-full.module';
import { SignupLinkModule } from './dialogs/signup-link/signup-link.module';
import { UpdateEmailModule } from './dialogs/update-email/update-email.module';
import { IndexComponent } from './pages/index/index.component';
import { IndexModule } from './pages/index/index.module';
import { SharedModule } from './modules/shared-module.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    IndexModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderModule,
    FooterModule,
    DialogModule,
    LoginModule,
    ReauthModule,
    ResetPasswordModule,
    SignupFullModule,
    SignupLinkModule,
    UpdateEmailModule,
    SharedModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production, registrationStrategy: 'registerImmediately' }),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAnalyticsModule,
    AngularFireAuthModule,
    AngularFirestoreModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
