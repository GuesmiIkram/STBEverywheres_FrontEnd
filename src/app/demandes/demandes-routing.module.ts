import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DemandeDecouvertComponent } from './demande-decouvert/demande-decouvert.component';
//import { CarteDetailsComponent } from './carte/carte-details/carte-details.component';

const routes: Routes = [
  // { path: '', loadChildren: () => import('./../paiement/virement/virement.module').then(mod => mod.VirementModule), data: { breadcrumb: 'Virement' } },
  //{ path: '', loadChildren: () => import('./../paiement/virement/virement.module').then(mod => mod.VirementModule), data: { breadcrumb: 'Virement' } },
  //{ path: 'pademandedecouvert', loadChildren: () => import('./../demandes/demande-decouvert/.module').then(mod => mod.CarteModule), data: { breadcrumb: 'Carte' } },
  //{ path: 'beneficiaire', loadChildren: () => import('./../paiement/beneficiaires/beneficiaire.module').then(mod => mod.BeneficiaireModule), data: { breadcrumb: 'Beneficiaire' } },
  //{ path: 'user', loadChildren: () => import('./../user/user.module').then(mod => mod.UserModule), data: { breadcrumb: 'User' } },
 //{ path: 'RepondreDemandedecouvert', component: DemandeDecouvertComponent }  // Ajout de la route


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DemandesRoutingModule { }
