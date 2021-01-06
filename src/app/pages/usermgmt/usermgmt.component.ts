import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usermgmt',
  templateUrl: './usermgmt.component.html',
  styleUrls: ['./usermgmt.component.scss']
})
export class UsermgmtComponent implements OnInit {

  constructor(
    private meta: Meta,
    private titleService: Title,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initSEO();
  }

  initSEO() {
    const title = 'iQuench | User Management';
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

}
