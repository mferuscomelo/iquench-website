import { Component, Inject, OnInit } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { Location } from 'src/app/interfaces/location';

@Component({
  selector: 'app-location-details',
  templateUrl: './location-details.component.html',
  styleUrls: ['./location-details.component.scss']
})
export class LocationDetailsComponent implements OnInit {

  location: Location;

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: { location: Location }) { 
    this.location = this.data.location;
  }

  ngOnInit(): void {
    
  }

}
