import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DemandesRoutingModule } from './demandes-routing.module';
import { DemandeDecouvertComponent } from './demande-decouvert/demande-decouvert.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    DemandeDecouvertComponent

  ],
  imports: [
    CommonModule,
    DemandesRoutingModule,
    ReactiveFormsModule

  ]
})
export class DemandesModule { }
