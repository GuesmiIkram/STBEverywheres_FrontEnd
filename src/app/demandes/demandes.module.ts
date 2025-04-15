import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { DemandesRoutingModule } from './demandes-routing.module';
import { DemandeDecouvertComponent } from './demande-decouvert/demande-decouvert.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DemandesChequierComponent } from './demandes-chequier/demandes-chequier.component';

@NgModule({
  declarations: [
    DemandeDecouvertComponent,
    DemandesChequierComponent

  ],
  imports: [
    CommonModule,
    DemandesRoutingModule,
    FormsModule,
    ReactiveFormsModule

  ]
})
export class DemandesModule { }
