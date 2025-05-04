import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr);

import { DemandesRoutingModule } from './demandes-routing.module';
import { DemandeDecouvertComponent } from './demande-decouvert/demande-decouvert.component';
import { DemandesChequierComponent } from './demandes-chequier/demandes-chequier.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DemandePlafondComponent } from './demande-plafond/demande-plafond.component';
import { DemandeCarteComponent } from './demande-carte/demande-carte.component';
import { DemandePackStudentComponent } from './demande-pack-student/demande-pack-student.component';
import { DemandePackElyssaComponent } from './demande-pack-elyssa/demande-pack-elyssa.component';

@NgModule({
  declarations: [
    DemandeDecouvertComponent,
    DemandesChequierComponent,
    DemandePlafondComponent,
    DemandeCarteComponent,
    DemandePackStudentComponent,
    DemandePackElyssaComponent
  ],
  imports: [
    CommonModule,
    DemandesRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'fr-FR' }
  ],
})
export class DemandesModule { }
