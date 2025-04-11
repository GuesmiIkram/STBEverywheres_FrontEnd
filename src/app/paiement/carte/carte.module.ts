import { CarteRoutingModule } from './carte-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarteItemComponent } from './carte-item/carte-item.component';
import { CarteDetailsComponent } from './carte-details/carte-details.component';
import { CarteComponent } from './carte.component';
import { DelivrerCarteComponent } from './delivrer-carte/delivrer-carte.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RechargeMesCartesComponent } from './recharge-mes-cartes/recharge-mes-cartes.component';
import { RechargeAutresCartesComponent } from './recharge-autres-cartes/recharge-autres-cartes.component';
import { HistoriqueRechargesComponent } from './historique-recharges/historique-recharges.component';



@NgModule({
  declarations: [
    CarteComponent,
    CarteItemComponent,
    CarteDetailsComponent,
    DelivrerCarteComponent,
    RechargeMesCartesComponent,
    RechargeAutresCartesComponent,
    HistoriqueRechargesComponent
  ],
  imports: [
    CommonModule,
    CarteRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  
  ]
})
export class CarteModule { }
