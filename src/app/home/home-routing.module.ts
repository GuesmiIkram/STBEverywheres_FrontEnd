import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home.component';
import { TFBankComponent } from '../tf-bank/tf-bank.component';
import { PackStudentComponent } from '../pack-student/pack-student.component';
import { PackElyssaComponent } from '../pack-elyssa/pack-elyssa.component';

const routes: Routes = [
  {path:'', component: HomeComponent ,
        children: [
          { path: 'PackStudent', component: PackStudentComponent, data: { breadcrumb: 'PackStudent' }},
           { path: '', component: DashboardComponent, data: { breadcrumb: 'Dashboard' }},
           { path: 'PackElyssa', component: PackElyssaComponent, data: { breadcrumb: 'PackElyssa' }},
           { path: 'TF', component: TFBankComponent, data: { breadcrumb: 'TFBank' }},
           
            { path: 'dashboard', component: DashboardComponent, data: { breadcrumb: 'Dashboard' }},
            { path: 'virement', loadChildren: () => import('./../paiement/virement/virement.module').then(mod => mod.VirementModule), data: { breadcrumb: 'Virement' } },
            { path: 'carte', loadChildren: () => import('./../paiement/carte/carte.module').then(mod => mod.CarteModule), data: { breadcrumb: 'Carte' } },
            { path: 'beneficiaire', loadChildren: () => import('./../paiement/beneficiaires/beneficiaire.module').then(mod => mod.BeneficiaireModule), data: { breadcrumb: 'Beneficiaire' } },
            { path: 'user', loadChildren: () => import('./../user/user.module').then(mod => mod.UserModule), data: { breadcrumb: 'User' } },
            { path: '**', redirectTo: '', pathMatch: 'full' },
            
        ],
    },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
