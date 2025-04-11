import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaiementRoutingModule } from './paiement-routing.module';
import { VirementModule } from './virement/virement.module';
import { CarteModule } from './carte/carte.module';
import { ChequierModule } from './chequiers/chequiers.module';
import { BeneficiaireModule } from './beneficiaires/beneficiaire.module';

@NgModule({
  declarations: [
    // PAS de ChequierModule ici
  ],
  imports: [
    CommonModule,
    PaiementRoutingModule,
    VirementModule,
    CarteModule,
    ChequierModule,
    BeneficiaireModule
  ]
})
export class PaiementModule { }
