export interface SnappedPoints {
  snappedPoints: SnappedPoint[];
}

export interface SnappedPoint {
  location:      Location;
  originalIndex: number;
  placeId:       string;
}

export interface Location {
  latitude:  number;
  longitude: number;
}
