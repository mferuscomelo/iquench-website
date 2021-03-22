import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Location } from 'src/app/interfaces/location';
import { LeaderboardEntry } from '../interfaces/leaderboard-entry';
import { User } from '../interfaces/user';
// import { AuthService } from './auth.service';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { HttpClient } from '@angular/common/http';
import { SnappedPoint, SnappedPoints } from '../interfaces/snapped-point';
import { environment } from 'src/environments/environment';
import { isPlatformBrowser } from '@angular/common';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(
    private firestore: AngularFirestore,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: string,
    // private authService: AuthService
  ) { }

  async createLocation(uid: string, isOperational: boolean, latLng: firebase.firestore.GeoPoint, notes: string) {
    // Exit if not in browser
    if(isPlatformBrowser(this.platformId)) return;

    const address = await this.getAddress(latLng);

    const location: Location = {
      id: `(${latLng.latitude},${latLng.longitude})`,
      uid,
      isOperational,
      latLng,
      notes,
      address,
      numFills: 0,
      ozFilled: 0,
      numReported: 0,
      lastUpdated: firebase.firestore.Timestamp.now(),
      status: 'pending'
    }

    return this.firestore.collection('locations').doc(location.id).set(location);
  }

  async isLocationPossible(latLng: firebase.firestore.GeoPoint): Promise<boolean> {
    return new Promise( async (resolve) => {
      // Distaces to nearest road
      // Max: 69.53m
      // Min: 0.48m
      // Avg: 23.14
  
      // CHECK IF ROAD IS LESS THAN 100m AWAY FROM ROAD
  
      // Get latitude and logitude of nearest road
      const nearestRoad = await this.getNearestRoad(latLng);
  
      // Convert to firestore GeoPoint
      const roadLatLng = new firebase.firestore.GeoPoint(nearestRoad.location.latitude, nearestRoad.location.longitude)
  
      // Calculate distance between points using Haversine Formula
      const distToRoad = this.calculateDistance(latLng, roadLatLng)

  
      // CHECK IF MARKER IS PLACED IN WATER
  
      // Load static map with water highlighted in lime green
      const map = new Image();
      const mapHeight = 160;
      const mapWidth = 1024;
  
      map.crossOrigin = 'http://maps.googleapis.com/crossdomain.xml';

      map.onload = () => {
        // Get center pixel color
        const x = mapWidth / 2;
        const y = mapHeight / 2;

        const canvas = document.createElement('canvas');
        canvas.height = mapHeight;
        canvas.width = mapWidth;

        const ctx = canvas.getContext('2d');

        if(!ctx) return resolve(false);

        ctx.drawImage(map, 0, 0, mapWidth, mapHeight);
        const pixels = ctx.getImageData(x, y, 1, 1).data;
  
        if(!pixels) return resolve(false);
  
        // Convert pixel color to a 3-dimensional array (rba)
        const color = [pixels[0], pixels[1], pixels[2]];
  
        // Convert the green color to a 3-dimensional array (rba)
        const green = [0, 255, 0]
  
        // Return if the pixel at the center of the map matches 0x00FF00 and the distance is less than 100m
        return resolve(!_.isEqual(green, color) && distToRoad < 100);
      };
  
      map.src = `http://maps.googleapis.com/maps/api/staticmap?
        scale=2
        &center=${latLng.latitude},${latLng.longitude}
        &zoom=13
        &size=${mapWidth}x${mapHeight}
        &style=feature:water|color:0x00FF00
        &style=element:labels|visibility:off
        &style=feature:transit|visibility:off
        &style=feature:poi|visibility:off
        &style=feature:road|visibility:off
        &style=feature:administrative|visibility:off
        &key=${environment.GOOGLE_MAPS_API_KEY}`.replace(/\s+/g, '');
    })
  }

  calculateDistance(latLng1: firebase.firestore.GeoPoint, latLng2: firebase.firestore.GeoPoint): number {
    // Use the Haversine formula to calculate the distance: https://en.wikipedia.org/wiki/Haversine_formula

    // Use the radius of the sphere (Earth) in meters => 6371km
    const r = 6371e3;

    // Convert latitude and longitudes to degrees
    const lat1_rad = this.deg2rad(latLng1.latitude);
    const lng1_rad = this.deg2rad(latLng1.longitude);

    const lat2_rad = this.deg2rad(latLng2.latitude);
    const lng2_rad = this.deg2rad(latLng2.longitude);

    // Calculate difference between latitudes and longitudes
    const dif_lat = lat1_rad - lat2_rad;
    const dif_lng = lng1_rad - lng2_rad;

    // Plug them into formula
    const a = Math.pow(Math.sin(dif_lat / 2), 2) + Math.cos(lat1_rad) * Math.cos(lat2_rad) * Math.pow(Math.sin(dif_lng / 2), 2) // Part under the sqrt
    const dist = 2 * r * Math.asin(Math.sqrt(a));

    return Math.abs(dist);
  }

  deg2rad(deg: number) {
    return deg * (Math.PI / 180);
  }

  async getNearestRoad(latLng: firebase.firestore.GeoPoint): Promise<SnappedPoint> {
    const queryString = `${latLng.latitude},${latLng.longitude}`;
    const requestString = `https://roads.googleapis.com/v1/nearestRoads?points=${queryString}&key=${environment.GOOGLE_MAPS_API_KEY}`

    return this.http
      .get<SnappedPoints>(requestString)
      .toPromise()
      .then( (result) => {
        return result.snappedPoints[0];
      });
  }

  async calcAvgDist() {
    const locations = await this.getData('locations') as Location[];

    let queryString: string = '';
    locations.forEach((location: Location) => {
      queryString += `${location.latLng.latitude},${location.latLng.longitude}|`;
    })
    queryString = queryString.slice(0, -1);

    const requestString = `https://roads.googleapis.com/v1/nearestRoads?points=${queryString}&key=${environment.GOOGLE_MAPS_API_KEY}`
    this.http
      .get<SnappedPoints>(requestString)
      .subscribe((response: SnappedPoints) => {
        const snappedPoints = response.snappedPoints;

        console.log(snappedPoints);

        let distances: number[] = [];
        let max: number = 0;
        let min: number = Infinity;
        let sum: number = 0;
        locations.forEach((location: Location, i: number) => {
          try {
            const snappedPoint = snappedPoints.filter(x => x.originalIndex == i)[0];
            const snappedPointLatLng = new firebase.firestore.GeoPoint(snappedPoint.location.latitude, snappedPoint.location.longitude)
            const dist = this.calculateDistance(location.latLng, snappedPointLatLng);
            distances.push(dist);

            if (dist > max) max = dist;
            if (dist < min) min = dist;
            sum += dist;
          } catch (error) {
            console.log('Error with: ', i);
          }
        });

        console.log('max: ', max);
        console.log('min: ', min);
        console.log('avg: ', sum / distances.length);
      })
  }

  async getData(dbName: string, condition?: { fieldName: string, value: string }) {
    let data: Location[] | User[] | LeaderboardEntry[] = [];

    let firestoreRef: AngularFirestoreCollection;
    if (condition)
      firestoreRef = this.firestore.collection(dbName, ref => ref.where(condition.fieldName, '==', condition.value));
    else
      firestoreRef = this.firestore.collection(dbName);

    await firestoreRef
      .get()
      .toPromise()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc: any) => {
          data.push(doc.data());
        });
      })
      .catch((error) => {
        console.error('Error getting data: ', error);
      });

    return data;
  }

  async getVerifiedFountains(uid: string): Promise<Location[]> {
    const userLocations = await this.getData('locations', { fieldName: 'uid', value: uid }) as Location[];
    return userLocations.filter(location => location.status == 'approved');
  }

  async getUnverifiedFountains(uid: string): Promise<Location[]> {
    const userLocations = await this.getData('locations', { fieldName: 'uid', value: uid }) as Location[];
    return userLocations.filter(location => location.status == 'pending');
  }

  async getDeniedFountains(uid: string): Promise<Location[]> {
    const userLocations = await this.getData('locations', { fieldName: 'uid', value: uid }) as Location[];
    return userLocations.filter(location => location.status == 'denied');
  }

  async updateLeaderboard() {
    return this.firestore
      .collection('public-users')
      .get()
      .toPromise()
      .then((data) => {
        let users: { uid: string, displayName: string }[] = [];

        data.forEach((doc: any) => {
          users.push({
            uid: doc.data().uid,
            displayName: doc.data().displayName
          })
        })

        users.forEach(async (user) => {
          const locations: Location[] = await this.getVerifiedFountains(user.uid);

          let numFills = 0;
          locations.forEach((location) => {
            numFills += location.numFills;
          });

          if (user.displayName && locations) {
            const uid = user.uid;
            const displayName = user.displayName;
            const numLocations = locations.length;
            const coins = numFills * 50 + numLocations * 500;

            const leaderboardEntry: LeaderboardEntry = {
              uid,
              displayName,
              numFills,
              numLocations,
              coins
            }

            this.firestore
              .collection('leaderboard')
              .doc(user.uid)
              .set(leaderboardEntry);
          }
        })
      });
  }

  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    const leaderboard: LeaderboardEntry[] = await this.getData('leaderboard') as LeaderboardEntry[];

    return leaderboard.sort((a, b) => (a.coins > b.coins ? -1 : 1))
  }

  latLngToString(latLng: firebase.firestore.GeoPoint): string {
    return `(${latLng.latitude},${latLng.longitude})`;
  }

  async updateField(dbName: string, condition: { fieldName: string, value: string }, fieldName: string, value: any) {
    this.firestore
      .collection(dbName, ref => ref.where(condition.fieldName, '==', condition.value))
      .get()
      .toPromise()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let updatedDoc: any = {};
          updatedDoc[`${fieldName}`] = value;
          doc.ref.update(updatedDoc);
        })
      });
  }

  getAddress(geoPoint: firebase.firestore.GeoPoint): Promise<string> {
    const latLng = new google.maps.LatLng(geoPoint.latitude, geoPoint.longitude);

    const geocoder = new google.maps.Geocoder;

    const address = new Promise<string>((resolve, reject) => {
      geocoder.geocode({
        'location': latLng
      }, (results, status) => {
        if (status == google.maps.GeocoderStatus.OK) {
          const splitAddressArray = results[0].formatted_address.split(',');
          const result = splitAddressArray[0] + ',' + splitAddressArray[1];
          resolve(result);
        } else {
          reject(status);
          console.error(new Error(status));
        }
      });
    });

    return address;
  }

}
