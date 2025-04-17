import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home.component';
import { DecouvertComponent } from './../ma-banque/decouvert/decouvert.component';
import { TFBankComponent } from '../tf-bank/tf-bank.component';
import { PackStudentComponent } from '../pack-student/pack-student.component';
import { PackElyssaComponent } from '../pack-elyssa/pack-elyssa.component';

import { DemandeDecouvertComponent } from 'src/app/demandes/demande-decouvert/demande-decouvert.component';

import { ReclamationComponent } from '../reclamation/reclamation.component';

import { SimulateurCreditComponent } from '../simulateur-credit/simulateur-credit.component';
import { DemandesChequierComponent } from '../demandes/demandes-chequier/demandes-chequier.component';
import { ReponseReclamationComponent } from '../reponse-reclamation/reponse-reclamation.component';
import { RibIbanComponent } from '../rib-iban/rib-iban.component';

import { DemandePlafondComponent } from '../demandes/demande-plafond/demande-plafond.component';
import { DemandeCarteComponent } from '../demandes/demande-carte/demande-carte.component';

import { DemandePackElyssaComponent } from '../demandes/demande-pack-elyssa/demande-pack-elyssa.component';
import { DemandePackStudentComponent } from '../demandes/demande-pack-student/demande-pack-student.component';
import { HistoriqueReclamationsComponent } from '../historique-reclamations/historique-reclamations.component';



const routes: Routes = [
  {path:'', component: HomeComponent ,
        children: [

          { path: 'similateur', component: SimulateurCreditComponent, data: { breadcrumb: 'similateur' }},
          { path: 'RepondreDemandePlafond', component: DemandePlafondComponent },
          { path: 'RepondreDemandeCarte', component: DemandeCarteComponent },
       
          { path: 'Reclamationhsitorique', component:   HistoriqueReclamationsComponent, data: { breadcrumb: 'reclamation' }},
          { path: 'Reclamation', component: ReclamationComponent, data: { breadcrumb: 'reclamation' }},
          { path: 'PackStudent', component: PackStudentComponent, data: { breadcrumb: 'PackStudent' }},
           { path: '', component: DashboardComponent, data: { breadcrumb: 'Dashboard' }},
           { path: 'PackElyssa', component: PackElyssaComponent, data: { breadcrumb: 'PackElyssa' }},
           { path: 'TF', component: TFBankComponent, data: { breadcrumb: 'TFBank' }},

            { path: 'dashboard', component: DashboardComponent, data: { breadcrumb: 'Dashboard' }},
            { path: 'virement', loadChildren: () => import('./../paiement/virement/virement.module').then(mod => mod.VirementModule), data: { breadcrumb: 'Virement' } },
            { path: 'carte', loadChildren: () => import('./../paiement/carte/carte.module').then(mod => mod.CarteModule), data: { breadcrumb: 'Carte' } },
            { path: 'beneficiaire', loadChildren: () => import('./../paiement/beneficiaires/beneficiaire.module').then(mod => mod.BeneficiaireModule), data: { breadcrumb: 'Beneficiaire' } },
            { path: 'user', loadChildren: () => import('./../user/user.module').then(mod => mod.UserModule), data: { breadcrumb: 'User' } },
            { path: 'decouvert', component: DecouvertComponent, data: { breadcrumb: 'Découvert' } },
            { path: 'chequier', loadChildren: () => import('./../paiement/chequiers/chequiers.module').then(mod => mod.ChequierModule), data: { breadcrumb: 'chequier' } },

            { path: 'RepondreDemandedecouvert', component: DemandeDecouvertComponent },

            { path: 'RepondreDemandesChequier', component: DemandesChequierComponent},
            { path: 'ReponseReclamationComponent', component: ReponseReclamationComponent, data: { breadcrumb: 'responsereclamation' }},
            { path: 'RibIbanComponent', component: RibIbanComponent, data: { breadcrumb: 'RibIban'}},

         
            { path: 'RepondreDemandePackStudent', component: DemandePackStudentComponent },
            { path: 'RepondreDemandePackElyssa', component: DemandePackElyssaComponent },


            { path: '**', redirectTo: '', pathMatch: 'full' }

        ],
    },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
