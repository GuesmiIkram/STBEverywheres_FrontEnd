import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';

import { LoginComponent } from './resgiter/login/login.component';
import { UserComponent } from './user/user.component';
import { VirementComponent } from './paiement/virement/virement.component';


import { AccueilComponent } from './accueil/accueil.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path:'', component: LoginComponent, data: {breadcrumb: 'Login'}},

 {path:'accueil', component: AccueilComponent },
 { path: 'reset-password', component: ResetPasswordComponent },

  {path:'home', loadChildren:()=> import('./home/home.module').then(mod => mod.HomeModule), data: {breadcrumb: 'Home'} },

  // {path:'test-error', component: TestErrorComponent, data: {breadcrumb: 'Test  Errors'}},
  // {path:'server-error', component: ServerErrorComponent, data: {breadcrumb: 'Server  Errors'}},
  // {path:'not-found', component: NotFoundComponent, data: {breadcrumb: 'Not Found'}},
   {path:'virement', loadChildren:()=> import('./paiement/virement/virement.module').then(mod => mod.VirementModule), data: {breadcrumb: 'Virement'} },
  // {path:'carte', loadChildren:()=> import('./paiement/carte/carte.module').then(mod => mod.CarteModule), data: {breadcrumb: 'Carte'} },
   //{path:'virement', loadChildren:()=> import('./paiement/virement/virement.module').then(mod => mod.VirementModule), data: {breadcrumb: 'Virement'} },
 {path:'carte', loadChildren:()=> import('./paiement/carte/carte.module').then(mod => mod.CarteModule), data: {breadcrumb: 'Carte'} },
  { path: 'beneficiaire', loadChildren: () => import('./paiement/beneficiaires/beneficiaire.module').then(mod => mod.BeneficiaireModule), data: { breadcrumb: 'Beneficiaire'} },
  { path: 'chequier', loadChildren: () => import('./paiement/chequiers/chequiers.module').then(mod => mod.ChequierModule), data: { breadcrumb: 'Beneficiaire'} },

  { path: 'ma-banque', loadChildren: () => import('./ma-banque/ma-banque.module').then(m => m.MaBanqueModule) },
  { path: 'demandes', loadChildren: () => import('./demandes/demandes.module').then(m => m.DemandesModule) },

  {path:'**', redirectTo:'not-found', pathMatch: 'full'},


   //{ path: 'user',component:UserComponent, loadChildren: () => import('./user/user.module').then(mod => mod.UserModule), data: { breadcrumb: 'User'} },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
