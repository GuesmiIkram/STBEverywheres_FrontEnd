import { CarteDetailsComponent } from './carte-details/carte-details.component';
import { CarteComponent } from './carte.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { DelivrerCarteComponent } from './delivrer-carte/delivrer-carte.component';
import { CarteItemComponent } from './carte-item/carte-item.component';
import { RechargeAutresCartesComponent } from './recharge-autres-cartes/recharge-autres-cartes.component';
import { RechargeMesCartesComponent } from './recharge-mes-cartes/recharge-mes-cartes.component';
import { HistoriqueRechargesComponent } from './historique-recharges/historique-recharges.component';


const routes: Routes = [
  { path: '', component: CarteComponent },
  { path: 'HistoriqueRecharges', component:  HistoriqueRechargesComponent, data: { breadcrumb: { alias: 'historiqueRecharge' } } },
  { path: 'RechargeMesCarte', component:  RechargeMesCartesComponent, data: { breadcrumb: { alias: 'mescartes' } } },
  { path: 'RechargeAutresCarte', component:   RechargeAutresCartesComponent, data: { breadcrumb: { alias: 'autrescartes' } } },
  { path: 'Demander-Plafond', component: CarteItemComponent, data: { breadcrumb: { alias: 'Item' } } },
  { path: 'Demander-Carte', component: DelivrerCarteComponent, data: { breadcrumb: { alias: 'Délivrer' } } },
  { path: ':numCarte', component: CarteDetailsComponent, data: { breadcrumb: { alias: 'Details' } } },
  
];
@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class CarteRoutingModule { }
