import { VirementComponent } from './virement.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VirementItemComponent } from './virement-item/virement-item.component';
import { VirementDetailsComponent } from './virement-details/virement-details.component';
import { VirementRoutingModule } from './virement-routing.module';
import { InitierVirementComponent } from './initier-virement/initier-virement.component';
import { ValiderVirementComponent } from './valider-virement/valider-virement.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { InitierVirementMasseComponent} from './initier-virement-masse/initier-virement-masse.component';

import { VirementService } from './virement.service';

@NgModule({
  declarations: [
    VirementComponent,
    VirementItemComponent,
    VirementDetailsComponent,
    InitierVirementComponent,
    ValiderVirementComponent,
    InitierVirementMasseComponent

  ],
  imports: [
    CommonModule,
    VirementRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [VirementService]
})
export class VirementModule { }
