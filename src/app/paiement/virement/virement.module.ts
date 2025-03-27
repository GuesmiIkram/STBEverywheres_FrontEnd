import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
//import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { VirementComponent } from './virement.component';
import { VirementItemComponent } from './virement-item/virement-item.component';
import { VirementDetailsComponent } from './virement-details/virement-details.component';

import { InitierVirementUnitaireAutreBenefComponent } from './initier-virement-unitaire-autre-benef/initier-virement-unitaire-autre-benef.component';
import { InitierVirementUnitaireMesComptesComponent } from './initier-virement-unitaire-mescomptes/initier-virement-unitaire-mescomptes.component';

import { InitierVirementMasseComponent } from './initier-virement-masse/initier-virement-masse.component';
import { VirementRoutingModule } from './virement-routing.module';
import { VirementService } from './virement.service';

@NgModule({
  declarations: [
    VirementComponent,
    VirementItemComponent,
    VirementDetailsComponent,
    InitierVirementUnitaireAutreBenefComponent,
    InitierVirementUnitaireMesComptesComponent,
    InitierVirementMasseComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    VirementRoutingModule
  ],
  providers: [VirementService]
})
export class VirementModule { }
