import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Loader } from '@googlemaps/js-api-loader';
import { } from 'googlemaps';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DialogComponent } from 'src/app/dialogs/dialog/dialog.component';
import { LoginComponent } from 'src/app/dialogs/login/login.component';
import { SignupLinkComponent } from 'src/app/dialogs/signup-link/signup-link.component';
import { PopupData } from 'src/app/interfaces/popup-data';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { environment } from 'src/environments/environment';

declare var confetti: any;

@Component({
  selector: 'app-create-location',
  templateUrl: './create-location.component.html',
  styleUrls: ['./create-location.component.scss']
})
export class CreateLocationComponent implements OnInit, OnDestroy {

  private destroy = new Subject<void>();

  form: FormGroup;

  get latLng() { return this.form.get('latLng') }
  get isOperational() { return this.form.get('isOperational') }
  get notes() { return this.form.get('notes') }
  get honeyPot() { return this.form.get('honeyPot') }

  map!: google.maps.Map;
  marker!: google.maps.Marker;
  markerIcon!: google.maps.ReadonlyIcon;

  isPlaced: boolean = false;
  isConfirmed: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.form = this.fb.group({
      'latLng': ['', [
        Validators.required
      ]],
      'isOperational': [true, [
        Validators.required
      ]],
      'notes': ['', []],
      'honeyPot': ['', []]
    });
  }

  ngOnInit(): void {
    const { zoom = 10, lat = 37.8199, lng = -122.4783 } = history.state;

    const loader = new Loader({
      apiKey: environment.GOOGLE_MAPS_API_KEY,
      version: 'beta',
      libraries: ['places'],
      mapIds: ['3da4417dac4fdc29']
    });

    loader.load().then(() => {
      const center = new google.maps.LatLng(lat, lng);

      this.markerIcon = {
        url: 'assets/icons/map-marker-blue.png',
        scaledSize: new google.maps.Size(27, 36),
      }

      // Initialize the map
      this.map = new google.maps.Map(document.getElementById('selector-map') as HTMLElement, {
        center,
        zoom,
        mapId: '3da4417dac4fdc29',
      } as google.maps.MapOptions);

      this.map.addListener('click', (event) => this.placeMarker(event))
    });
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  placeMarker(event: google.maps.MapMouseEvent) {
    if (this.isPlaced) {
      this.marker.setPosition(event.latLng);
    } else {
      this.marker = new google.maps.Marker({
        position: event.latLng,
        map: this.map,
        draggable: true,
        icon: this.markerIcon
      });

      this.isPlaced = true;
    }
  }

  confirmLocation() {
    this.isConfirmed = true;
    this.latLng?.setValue(this.marker.getPosition()?.toString());
  }

  submit() {
    if (!this.form.valid && this.honeyPot?.value == '') return;

    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      this.dialog
        .open(LoginComponent)
        .afterClosed()
        .pipe(
          takeUntil(this.destroy)
        )
        .subscribe((isLoggedIn) => {
          if (isLoggedIn) {
            this.createLocation();
          }
        });
    } else {
      this.createLocation();
    }
  }

  async createLocation() {
    let firstTime: boolean = false;
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) return;

    if ((await this.firestoreService.getVerifiedFountains(currentUser.uid)).length == 0) {
      firstTime = true;
    }

    await this.firestoreService.createLocation(currentUser.uid, this.isOperational?.value, this.latLng?.value, this.notes?.value);

    if (firstTime) {
      confetti.start();

      this.dialog.open(DialogComponent, {
        data: {
          title: 'Congratulations!',
          fa_icon: 'fas fa-trophy',
          fa_icon_class: 'gold-color',
          text: 'You just added your first water fountain to the map!',
          confirmButtonText: 'Continue',
        }
      }).afterClosed().subscribe(async () => {
        confetti.remove();

        if (currentUser.isAnonymous) {
          this.dialog.open(SignupLinkComponent)
            .afterClosed().subscribe(() => {
              console.log('Dialog closed!');
              this.router.navigate(['map']);
            });
        }
      });
    } else {
      this.dialog.open(DialogComponent, {
        data: {
          title: 'Great Job!',
          icon: 'success',
          text: 'You just added another water fountain to the map.',
          confirmButtonText: 'Continue',
        } as PopupData
      });

      await this.router.navigate(['map']);
    }
  }
}
