import { PaiementModule } from './../paiement/paiement.module';
import { NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { HomeComponent } from './home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { CoreModule } from '../core/core.module';
import { HomeRoutingModule } from './home-routing.module';
import { PaiementRoutingModule } from '../paiement/paiement-routing.module';
import { MaBanqueRoutingModule } from '../ma-banque/ma-banque-routing.module';
import { MaBanqueModule } from './../ma-banque/ma-banque.module';
import { DashbordAgentComponent } from './../dashbord-agent/dashbord-agent.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgChartsModule } from 'ng2-charts';
import localeFr from '@angular/common/locales/fr';
@NgModule({
  declarations: [
    HomeComponent,
    DashboardComponent,
    DashbordAgentComponent,
    SideBarComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    HomeRoutingModule,
    PaiementModule,
    MaBanqueModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    NgChartsModule


  ],
  exports: [
    HomeComponent
  ]
})
export class HomeModule {
  constructor() {
  registerLocaleData(localeFr, 'fr');
}}

