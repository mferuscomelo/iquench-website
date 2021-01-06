// Generated by https://quicktype.io

export interface OSMData {
    version:   number;
    generator: string;
    osm3s:     Osm3S;
    elements:  OSMElement[];
}

export interface OSMElement {
    type: 'node';
    id:   number;
    lat:  number;
    lon:  number;
    tags: Tags;
}

export interface Tags {
    amenity: 'drinking_water';
}

export interface Osm3S {
    timestamp_osm_base: string;
    copyright:          string;
}
