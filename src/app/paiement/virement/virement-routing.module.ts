import { VirementDetailsComponent } from './virement-details/virement-details.component';
import { VirementComponent } from './virement.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValiderVirementComponent } from './valider-virement/valider-virement.component';
import { InitierVirementComponent } from './initier-virement/initier-virement.component';
import { InitierVirementMasseComponent} from './initier-virement-masse/initier-virement-masse.component';



const routes: Routes = [
  { path: '', component: VirementComponent },
  { path: 'create-virement', component: InitierVirementComponent, data: { breadcrumb: { alias: 'InitierVirement' } } },
  { path: 'valider-virement', component: ValiderVirementComponent, data: { breadcrumb: { alias: 'virementDetails' } } },
  { path: 'create-virement-masse', component: InitierVirementMasseComponent, data: { breadcrumb: { alias: 'InitierVirementMasse' } } },

  { path: ':id', component: VirementDetailsComponent, data: { breadcrumb: { alias: 'virementDetails' } } }, //  Placé tjrs
  // en dernier !
];


@NgModule({
  imports: [    RouterModule.forChild(routes)
],
  exports: [RouterModule]
})
export class VirementRoutingModule { }


