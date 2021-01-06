import { Component, OnInit } from '@angular/core';
import { Loader } from "@googlemaps/js-api-loader"
import { environment } from 'src/environments/environment';
import {} from 'googlemaps';
import { Location } from 'src/app/interfaces/location';
import { FirestoreService } from 'src/app/services/firestore.service';
import { OsmService } from 'src/app/services/osm.service';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { LocationDetailsComponent } from 'src/app/components/location-details/location-details.component';
import MarkerClusterer from '@googlemaps/markerclustererplus';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PopupData } from 'src/app/interfaces/popup-data';
import { DialogComponent } from 'src/app/dialogs/dialog/dialog.component';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  map!: google.maps.Map;
  myLocationMarker!: google.maps.Marker;
  markerCluster!: MarkerClusterer;

  myMarker!: google.maps.Icon
  blueMarker!: google.maps.Icon
  greyMarker!: google.maps.Icon

  constructor(
    private firestoreService: FirestoreService,
    private osmService: OsmService,
    private analytics: AngularFireAnalytics,
    private bottomSheet: MatBottomSheet,
    private dialog: MatDialog,
    private meta: Meta,
    private titleService: Title,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initSEO();

    const loader = new Loader({
      apiKey: environment.GOOGLE_MAPS_API_KEY,
      version: 'beta',
      libraries: ['places'],
      mapIds: ['3da4417dac4fdc29']
    });

    loader.load().then( () => {
      // Initialize the map
      this.map = new google.maps.Map(document.getElementById('main-map') as HTMLElement, {
        center: {lat: 37.8199, lng: -122.4783},
        zoom: 10,
        mapId: '3da4417dac4fdc29'
      } as google.maps.MapOptions);

      // Initialize markers
      this.blueMarker = {
        url: 'assets/icons/map-marker-blue.png',
        scaledSize: new google.maps.Size(27, 36),
      }
    
      this.greyMarker = {
        url: 'assets/icons/map-marker-grey.png',
        scaledSize: new google.maps.Size(27, 36),
      }

      this.myMarker = {
        url: 'assets/icons/map-marker-red.png',
        scaledSize: new google.maps.Size(27, 36),
      }
      
      // Initialize the MarkerClusterer
      this.markerCluster = new MarkerClusterer(this.map, undefined, {
        imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
      });

      this.getLocations();

      this.map.addListener('idle', async () => {
        if(this.map.getZoom() >= 10) {
          const locations: Location[] = await this.getOSMData();
          this.showLocations(locations);
        }
      });

      // Getting User location
      const data: PopupData = {
        icon: 'warning',
        title: 'Share Location',
        text: 'Please share your location so we can better help you.',
        confirmButtonText: 'Ok',
        cancelButtonText: 'No, thank you',
      }
      let dialogRef: MatDialogRef<DialogComponent>;
  
      const nudgeTimeout = setTimeout( () => {
        dialogRef = this.dialog.open(DialogComponent, { data })
      }, 5000);
  
      const geoSuccess: PositionCallback = (position) => {
        dialogRef?.close();
        clearTimeout(nudgeTimeout);
        
        const myCoords = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  
        // Move and recenter map
        this.map.setZoom(15);
        this.map.panTo(myCoords);
  
        // Show user location
        if(this.myLocationMarker)
          this.myLocationMarker.setPosition(myCoords)
        else
          this.myLocationMarker = new google.maps.Marker({
            position: myCoords,
            icon: this.myMarker,
            map: this.map
          })
      }
  
      const geoError: PositionErrorCallback = (error) => {
        switch (error.code) {
          case error.TIMEOUT:
            dialogRef = this.dialog.open(DialogComponent, { data })
            break;
        }
      }
  
      navigator.geolocation.watchPosition(geoSuccess, geoError);
    }); 

  }

  initSEO() {
    const title = 'iQuench | Map';
    const description = 'A free web app to help outdoor enthusiasts find publicly available drinking water fountains.';
    this.titleService.setTitle(title);
    // TODO: add image tag
    this.meta.addTags([
      { name: 'title', content: title },
      { name: 'description', content: description },
      { name: 'og:type', content: 'website' },
      { name: 'og:url', content: window.location.href },
      { name: 'og:title', content: title },
      { name: 'og:description', content: description },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:url', content: window.location.href },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
    ]);
  }

  async getLocations() {
    let locations: Location[] = [];

    locations.push(...await this.getFirestoreData());
    locations.push(...await this.getOSMData());

    this.showLocations(locations);
  }

  async showLocations(locations: Location[]) {
    let markers: google.maps.Marker[] = [];

    locations.forEach( (location: Location) => {
      const marker = new google.maps.Marker({
        position: new google.maps.LatLng(location.latLng.latitude, location.latLng.longitude),
        icon: location.isOperational ? this.blueMarker : this.greyMarker,
        map: this.map
      });

      markers.push(marker);

      marker.addListener('click', () => {
        this.analytics.logEvent('show_location_details');

        this.bottomSheet.open(LocationDetailsComponent, {
          data: {
            location
          }
        })
      })
    })

    this.markerCluster.addMarkers(markers);
  }


  async getFirestoreData(): Promise<Location[]> {
    return await this.firestoreService.getData('locations') as Location[];
  }

  async getOSMData() {
    const locationLoadingBounds = this.getLocationLoadingBounds();
    return await this.osmService.getLocations(locationLoadingBounds);
  }

  getLocationLoadingBounds(): string {
    const bounds = this.map.getBounds();
    var ne = bounds!.getNorthEast();
    var sw = bounds!.getSouthWest();

    var height = ne.lat() - sw.lat();
    var width = ne.lng() - sw.lng();

    var buffer = 0.5;
    var new_n;
    var new_s;
    var new_e;
    var new_w;
    var dim_sq;
    var additionalRange;

    if(height >= width) {
      dim_sq = height + (buffer / 2);
      additionalRange = (dim_sq - width) / 2;

      new_n = ne.lat() + (buffer / 2);
      new_s = sw.lat() - (buffer / 2);
      new_e = ne.lng() + additionalRange;
      new_w = sw.lng() - additionalRange;
    } else {
      dim_sq = width + (buffer / 2);
      additionalRange = (dim_sq - height) / 2;

      new_n = ne.lat() + additionalRange;
      new_s = sw.lat() - additionalRange;
      new_e = ne.lng() + (buffer / 2);
      new_w = sw.lng() - (buffer / 2);
    }

    var new_ne = new google.maps.LatLng(new_n, new_e);
    var new_sw = new google.maps.LatLng(new_s, new_w);

    return new_sw.toUrlValue(14) + ',' + new_ne.toUrlValue(14);
  }

}
