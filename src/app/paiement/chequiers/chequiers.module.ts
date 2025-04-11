import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ChequiersComponent } from './chequiers.component';
import { DemandeChequierComponent } from './demande-chequier/demande-chequier.component';
import { ListechequiersComponent } from './liste-chequiers/liste-chequiers.component';
import { SuiviDemandechequiersComponent } from './suivi-demandechequiers/suivi-demandechequiers.component';

import { ChequierRoutingModule } from './chequiers-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    ChequiersComponent,
    DemandeChequierComponent,
    ListechequiersComponent,
    SuiviDemandechequiersComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgbModule,
    ChequierRoutingModule
  ],
})
export class ChequierModule { }
