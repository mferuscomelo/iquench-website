import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeaderboardRoutingModule } from './leaderboard-routing.module';
import { LeaderboardComponent } from './leaderboard.component';
import { HeaderModule } from 'src/app/components/header/header.module';
import { FooterModule } from 'src/app/components/footer/footer.module';
import { MatComponentsModule } from 'src/app/modules/mat-components.module';
import { FaComponentsModule } from 'src/app/modules/fa-components.module';
import { SharedModule } from 'src/app/modules/shared-module.module';


@NgModule({
  declarations: [LeaderboardComponent],
  imports: [
    CommonModule,
    LeaderboardRoutingModule,
    // HeaderModule,
    // FooterModule,
    SharedModule,
  ]
})
export class LeaderboardModule { }
