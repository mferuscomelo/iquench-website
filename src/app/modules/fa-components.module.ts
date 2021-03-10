import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faTwitterSquare } from '@fortawesome/free-brands-svg-icons';
import { faFacebookSquare } from '@fortawesome/free-brands-svg-icons';
import { faInstagramSquare } from '@fortawesome/free-brands-svg-icons';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faChevronRight as fasChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faChevronDown as fasChevronDown } from '@fortawesome/free-solid-svg-icons';
import { faUserCircle as fasUserCircle } from '@fortawesome/free-solid-svg-icons';
import { faCog as fasCog } from '@fortawesome/free-solid-svg-icons';
import { faSignOutAlt as fasSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { faChartPie as fasChartPie } from '@fortawesome/free-solid-svg-icons';
import { faMapMarkedAlt as fasMapMarkedAlt } from '@fortawesome/free-solid-svg-icons';
import { faClock as fasClock } from '@fortawesome/free-solid-svg-icons';
import { faBolt as fasBolt } from '@fortawesome/free-solid-svg-icons';
import { faDollarSign as fasDollarSign } from '@fortawesome/free-solid-svg-icons';
import { faCheckCircle as fasCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { faTree as fasTree } from '@fortawesome/free-solid-svg-icons';
import { faMapMarkerAlt as fasMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faQuoteLeft as fasQuoteLeft } from '@fortawesome/free-solid-svg-icons';
import { faPlus as fasPlus } from '@fortawesome/free-solid-svg-icons';
import { faUser as fasUser } from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

@NgModule({
  exports: [
    FontAwesomeModule
  ]
})
export class FaComponentsModule {
  constructor(library: FaIconLibrary) {
    library.addIcons( 
      fasChevronRight,
      fasChevronDown,
      faTwitterSquare,
      faFacebookSquare,
      faInstagramSquare,
      faLinkedin,
      fasUserCircle,
      fasCog,
      fasSignOutAlt,
      fasChartPie,
      fasMapMarkedAlt,
      fasClock,
      fasBolt,
      fasDollarSign,
      fasCheckCircle,
      fasTree,
      fasMapMarkerAlt,
      fasQuoteLeft,
      fasPlus,
      fasUser,
      faGoogle
    );
  }
}
