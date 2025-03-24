import { PaiementModule } from './../paiement/paiement.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { CoreModule } from '../core/core.module';
import { HomeRoutingModule } from './home-routing.module';
import { PaiementRoutingModule } from '../paiement/paiement-routing.module';

import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    HomeComponent,
    DashboardComponent,
    SideBarComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    HomeRoutingModule,
    PaiementModule,
    FormsModule,

  ],
  exports: [
    HomeComponent
  ]
})
export class HomeModule { }
