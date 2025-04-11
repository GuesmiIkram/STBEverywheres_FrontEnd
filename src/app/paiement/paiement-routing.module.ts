import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarteDetailsComponent } from './carte/carte-details/carte-details.component';

const routes: Routes = [
  // { path: '', loadChildren: () => import('./../paiement/virement/virement.module').then(mod => mod.VirementModule), data: { breadcrumb: 'Virement' } },
  { path: 'virement', loadChildren: () => import('./../paiement/virement/virement.module').then(mod => mod.VirementModule), data: { breadcrumb: 'Virement' } },
  { path: 'carte', loadChildren: () => import('./../paiement/carte/carte.module').then(mod => mod.CarteModule), data: { breadcrumb: 'Carte' } },
  { path: 'beneficiaire', loadChildren: () => import('./../paiement/beneficiaires/beneficiaire.module').then(mod => mod.BeneficiaireModule), data: { breadcrumb: 'Beneficiaire' } },
  { path: 'chequier', loadChildren: () => import('./../paiement/chequiers/chequiers.module').then(mod => mod.ChequierModule), data: { breadcrumb: 'Chequier' } },

  { path: 'user', loadChildren: () => import('./../user/user.module').then(mod => mod.UserModule), data: { breadcrumb: 'User' } },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaiementRoutingModule { }
