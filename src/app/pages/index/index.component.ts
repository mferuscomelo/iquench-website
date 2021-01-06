import { ViewportScroller } from '@angular/common';
import { AfterContentInit, Component, HostListener, Inject, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, AfterContentInit {

  constructor(
    private viewPortScroller: ViewportScroller,
    private meta: Meta,
    private titleService: Title,
    private router: Router
  ) { }
  
  ngOnInit(): void { 
    this.initSEO();
  }
  
  ngAfterContentInit(): void {
    window.addEventListener('scroll', (e: Event) => {
      const scrollPos = this.viewPortScroller.getScrollPosition()[1];
      const header = document.querySelector('app-header');

      if(header) {
        if(scrollPos > header.clientHeight)
          header.classList.remove('transparent');
        else
          header.classList.add('transparent');
      }
    });
  }

  initSEO() {
    const title = 'iQuench | Home';
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
