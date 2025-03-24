import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BeneficiaireItemComponent } from './beneficiaire-item/beneficiaire-item.component';
import { BeneficiaireDetailsComponent } from './beneficiaire-details/beneficiaire-details.component';
import { BeneficiairesComponent } from './beneficiaires.component';
import { BeneficiaireRoutingModule } from './beneficiaire-routing.module';
import { AddBeneficiaireComponent } from './add-beneficiaire/add-beneficiaire.component';

import { FormsModule } from '@angular/forms'; // Import FormsModule


@NgModule({
  declarations: [
    BeneficiairesComponent,
    BeneficiaireItemComponent,
    BeneficiaireDetailsComponent,
    AddBeneficiaireComponent
  ],
  imports: [
    CommonModule,
    BeneficiaireRoutingModule,
    FormsModule
  ]
})
export class BeneficiaireModule { }
