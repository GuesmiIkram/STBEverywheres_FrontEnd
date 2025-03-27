import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VirementComponent } from './virement.component';
import { InitierVirementUnitaireMesComptesComponent } from './initier-virement-unitaire-mescomptes/initier-virement-unitaire-mescomptes.component';
import { InitierVirementUnitaireAutreBenefComponent } from './initier-virement-unitaire-autre-benef/initier-virement-unitaire-autre-benef.component';
import { InitierVirementMasseComponent } from './initier-virement-masse/initier-virement-masse.component';
import { VirementDetailsComponent } from './virement-details/virement-details.component';

const routes: Routes = [
  { path: '', component: VirementComponent },
  { path: 'virement-unitaire-AutreBeneiciaire', component: InitierVirementUnitaireAutreBenefComponent, data: { breadcrumb: { alias: 'InitierVirementUnitaireAutreBenef' } } },
  { path: 'virement-unitaire-mescomptes', component: InitierVirementUnitaireMesComptesComponent, data: { breadcrumb: { alias: 'InitierVirementUnitaireMesComptes' } } },
  { path: 'create-virement-masse', component: InitierVirementMasseComponent, data: { breadcrumb: { alias: 'InitierVirementMasse' } } },
  { path: ':id', component: VirementDetailsComponent, data: { breadcrumb: { alias: 'virementDetails' } } }, // Always placed last!
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VirementRoutingModule { }
