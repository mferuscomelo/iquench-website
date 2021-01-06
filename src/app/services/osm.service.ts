import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OSMData } from '../interfaces/osm-data';
import { Location } from 'src/app/interfaces/location'
import firebase from 'firebase/app';
import 'firebase/firestore';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class OsmService {

  constructor(
    private http: HttpClient,
    private firestoreService: FirestoreService
  ) { }

  getLocations(locationLoadingBounds: string): Promise<Location[]> {
    const osmUrl = 'https://overpass-api.de/api/interpreter?data=';
    var query = '[out:json];node[amenity=drinking_water](' + locationLoadingBounds +');out;&target=mapql';
    const dataUrl = osmUrl + encodeURI(query);

    return new Promise( (resolve, reject) => {
      this.http
      .get<OSMData>(dataUrl)
      .toPromise<OSMData>()
      .then( (response: OSMData) => {
        let locations: Location[] = [];
        const osmLocations = response.elements;

        osmLocations.forEach( (osmLocation) => {
          const latLng = new firebase.firestore.GeoPoint(osmLocation.lat, osmLocation.lon);

          const location: Location = {
            id: this.firestoreService.latLngToString(latLng),
            uid: '',
            latLng: latLng,
            numFills: 0,
            ozFilled: 0,
            notes: 'No notes :(',
            isOperational: true,
            numReported: 0,
            address: '',
            lastUpdated: firebase.firestore.Timestamp.now(),
            status: 'approved'
          }

          locations.push(location);
        });

        resolve(locations);
      });
    }) 
  }
}
