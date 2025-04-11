import { ChequiersComponent } from './chequiers.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListechequiersComponent } from './liste-chequiers/liste-chequiers.component';
import { DemandeChequierComponent } from './demande-chequier/demande-chequier.component';
import { RouterModule, Routes } from '@angular/router';
import { SuiviDemandechequiersComponent } from './suivi-demandechequiers/suivi-demandechequiers.component';


const routes: Routes = [
  { path: '', component: ChequiersComponent },
  { path: 'demander-chequier', component: DemandeChequierComponent , data: { breadcrumb: { alias: 'demnde' } } },
  { path: 'liste-demandechequiers', component: ListechequiersComponent , data: { breadcrumb: { alias: 'listedemnde' } } },

  { path: 'suivi-demandechequiers', component:SuiviDemandechequiersComponent  , data: { breadcrumb: { alias: 'suividemnde' } } },

  { path: ':id', component: ListechequiersComponent, data: { breadcrumb: { alias: 'liste' } } },
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
export class ChequierRoutingModule { }
