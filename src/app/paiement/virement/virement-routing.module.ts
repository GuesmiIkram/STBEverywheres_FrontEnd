import { VirementDetailsComponent } from './virement-details/virement-details.component';
import { VirementComponent } from './virement.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValiderVirementComponent } from './valider-virement/valider-virement.component';
import { InitierVirementComponent } from './initier-virement/initier-virement.component';



const routes: Routes = [
  { path: '', component: VirementComponent },
  { path: ':id', component: VirementDetailsComponent, data: { breadcrumb: { alias: 'virementDetails' } } },
  { path: 'create-virement', component: InitierVirementComponent, data: { breadcrumb: { alias: 'virementDetails' } } },
  { path: 'valider-virement', component: ValiderVirementComponent, data: { breadcrumb: { alias: 'virementDetails' } } },
]

@NgModule({
  imports: [    RouterModule.forChild(routes)
],
  exports: [RouterModule]
})
export class VirementRoutingModule { }


