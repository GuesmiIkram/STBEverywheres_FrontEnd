import { VirementComponent } from './virement.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VirementItemComponent } from './virement-item/virement-item.component';
import { VirementDetailsComponent } from './virement-details/virement-details.component';
import { VirementRoutingModule } from './virement-routing.module';
import { InitierVirementComponent } from './initier-virement/initier-virement.component';
import { ValiderVirementComponent } from './valider-virement/valider-virement.component';



@NgModule({
  declarations: [
    VirementComponent,
    VirementItemComponent,
    VirementDetailsComponent,
    InitierVirementComponent,
    ValiderVirementComponent,
  ],
  imports: [
    CommonModule,
    VirementRoutingModule
  ]
})
export class VirementModule { }
