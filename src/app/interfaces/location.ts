import firebase from 'firebase/app';
import 'firebase/firestore';

export interface Location {
    id: string;
    uid: string;
    isOperational: boolean;
    latLng: firebase.firestore.GeoPoint;
    notes: string;
    numFills: number;
    ozFilled: number;
    numReported: number;
    address: string;
    lastUpdated: firebase.firestore.Timestamp;
    status: 'approved' | 'pending' | 'denied';
}
