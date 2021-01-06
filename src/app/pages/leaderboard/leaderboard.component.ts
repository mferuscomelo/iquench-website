import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LeaderboardEntry } from 'src/app/interfaces/leaderboard-entry';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {

  leaderboardEntries!: LeaderboardEntry[];

  constructor(
    private firestoreService: FirestoreService,
    private meta: Meta,
    private titleService: Title,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initSEO();
    this.getLeaderboard();
  }

  initSEO() {
    const title = 'iQuench | Leaderboard';
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

  async getLeaderboard() {
    const leaderboard = await this.firestoreService.getLeaderboard();
    this.leaderboardEntries = leaderboard.slice(0, 10);
  }

}
