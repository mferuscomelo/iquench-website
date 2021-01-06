import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Location } from 'src/app/interfaces/location';
import { LeaderboardEntry } from '../interfaces/leaderboard-entry';
import { User } from '../interfaces/user';
import { AuthService } from './auth.service';
import firebase from 'firebase/app';
import 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(
    private firestore: AngularFirestore
  ) {}

  async getData(dbName: string, condition?: { fieldName: string, value: string}) {
    let data: Location[] | User[] | LeaderboardEntry[] = [];

    let firestoreRef: AngularFirestoreCollection;
    if(condition)
      firestoreRef = this.firestore.collection(dbName, ref => ref.where(condition.fieldName, '==', condition.value));
    else
      firestoreRef = this.firestore.collection(dbName);

    await firestoreRef
      .get()
      .toPromise()
      .then( (querySnapshot) => {
        querySnapshot.forEach( (doc: any) => {
          data.push(doc.data());
        });
      })
      .catch( (error) => {
        console.error('Error getting data: ', error);
      });

    return data;
  }

  async getVerifiedFountains(uid: string): Promise<Location[]> {
    const userLocations = await this.getData('locations', { fieldName: 'uid', value: uid}) as Location[];
    return userLocations.filter(location => location.status == 'approved');
  }

  async getUnverifiedFountains(uid: string): Promise<Location[]> {
    const userLocations = await this.getData('locations', { fieldName: 'uid', value: uid}) as Location[];
    return userLocations.filter(location => location.status == 'pending');
  }

  async getDeniedFountains(uid: string): Promise<Location[]> {
    const userLocations = await this.getData('locations', { fieldName: 'uid', value: uid}) as Location[];
    return userLocations.filter(location => location.status == 'denied');
  }

  async updateLeaderboard() {
    return this.firestore
      .collection('public-users')
      .get()
      .toPromise()
      .then( (data) => {
        let users: { uid: string, displayName: string }[] = [];

        data.forEach( (doc: any) => {
          users.push({
            uid: doc.data().uid,
            displayName: doc.data().displayName
          })
        })

        users.forEach( async (user) => {
          const locations: Location[] = await this.getVerifiedFountains(user.uid);
    
          let numFills = 0;
          locations.forEach( (location) => {
            numFills += location.numFills;
          });
    
          if(user.displayName && locations) {
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
    const leaderboard: LeaderboardEntry[] =  await this.getData('leaderboard') as LeaderboardEntry[];

    return leaderboard.sort( (a, b) => (a.coins > b.coins ? -1 : 1))
  }

  latLngToString(latLng: firebase.firestore.GeoPoint): string {
    return `(${latLng.latitude},${latLng.longitude})`;
  }

  async updateField(dbName: string, condition: { fieldName: string, value: string}, fieldName: string, value: any) {
    this.firestore
      .collection(dbName, ref => ref.where(condition.fieldName, '==', condition.value))
      .get()
      .toPromise()
      .then( (querySnapshot) => {
        querySnapshot.forEach( (doc) => {
          let updatedDoc: any = {};
          updatedDoc[`${fieldName}`] = value;
          doc.ref.update(updatedDoc);
        })
      });
  }

}
