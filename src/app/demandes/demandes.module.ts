import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { DemandesRoutingModule } from './demandes-routing.module';
import { DemandeDecouvertComponent } from './demande-decouvert/demande-decouvert.component';


import { DemandesChequierComponent } from './demandes-chequier/demandes-chequier.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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

    FormsModule,
    ReactiveFormsModule



  ]
})
export class DemandesModule { }