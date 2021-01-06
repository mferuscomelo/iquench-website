import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Location } from 'src/app/interfaces/location';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['lastUpdated', 'address', 'numFills', 'ozFilled', 'status'];
  dataSource!: MatTableDataSource<Location>;

  leaderboardPosition!: number;
  numFountainsAdded!: number;
  moneySaved!: number;
  numBottlesSaved!: number

  constructor(
    public firestoreService: FirestoreService,
    private authService: AuthService,
    private meta: Meta,
    private titleService: Title,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initSEO();
    this.getData();
  }

  initSEO() {
    const title = 'iQuench | Dashboard';
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

  async getData() {
    this.firestoreService.updateLeaderboard()
      .catch( (error) => {
        console.error('Error updating leaderboard: ', error);
      });

    const currentUser = this.authService.getCurrentUser();

    if(currentUser) {
      const verifiedLocations = await this.firestoreService.getVerifiedFountains(currentUser.uid);
      const unverifiedLocations = await this.firestoreService.getUnverifiedFountains(currentUser.uid);
      const deniedLocations = await this.firestoreService.getDeniedFountains(currentUser.uid);

      const allLocations = verifiedLocations.concat(unverifiedLocations).concat(deniedLocations);
      this.dataSource = new MatTableDataSource(allLocations);
      // this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      if(verifiedLocations) {
        this.numFountainsAdded = verifiedLocations.length;

        const filledLocations = verifiedLocations.filter(location => location.ozFilled > 0);

        let ozFilled = 0;
        filledLocations.forEach( (location) => {
          ozFilled += location.ozFilled;
        });

        this.numBottlesSaved = Math.floor(ozFilled / 16.9);
        this.moneySaved = Math.floor(this.numBottlesSaved * 0.7);
      } else {
        this.numFountainsAdded = 0;
        this.numBottlesSaved = 0;
        this.moneySaved = 0;
      }

      const leaderboard = await this.firestoreService.getLeaderboard();
      const userLeaderboard = leaderboard.find(entry => entry.uid == currentUser.uid);
      if(userLeaderboard)
        this.leaderboardPosition = leaderboard.indexOf(userLeaderboard) + 1;
      else
        this.leaderboardPosition = 0;
    }
  }

}
