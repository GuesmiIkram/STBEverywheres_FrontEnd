import { BeneficiaireModule } from './beneficiaires/beneficiaire.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaiementRoutingModule } from './paiement-routing.module';
import { VirementModule } from './virement/virement.module';
import { CarteModule } from './carte/carte.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BeneficiaireModule,
    VirementModule,
    CarteModule,
    PaiementRoutingModule
  ]
})
export class PaiementModule { }
