import { BeneficiairesComponent } from './beneficiaires.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { BeneficiaireDetailsComponent } from './beneficiaire-details/beneficiaire-details.component';
import { AddBeneficiaireComponent } from './add-beneficiaire/add-beneficiaire.component';

const routes: Routes = [
  { path: '', component: BeneficiairesComponent },
  { path: ':id', component: BeneficiaireDetailsComponent, data: { breadcrumb: { alias: 'Ajouter' } } },
  { path: 'ajouter-beneficiaire', component: AddBeneficiaireComponent, data: { breadcrumb: { alias: 'Details' } } },
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports :[
    RouterModule
  ]
})
export class BeneficiaireRoutingModule { }
