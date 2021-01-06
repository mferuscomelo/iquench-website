import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();

  // if(window){
  //   window.console.log=function(){};
  // }
}

// if(window.location.hostname == 'localhost') {
//   window['ga-disable-G-ZPR9VNN72E'] = true;
// } else {
//   window['ga-disable-G-ZPR9VNN72E'] = false;
// }

document.addEventListener('DOMContentLoaded', () => {
  platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));
});
