import { CarteDetailsComponent } from './carte-details/carte-details.component';
import { CarteComponent } from './carte.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { DelivrerCarteComponent } from './delivrer-carte/delivrer-carte.component';


const routes: Routes = [
  { path: '', component: CarteComponent },
  { path: ':id', component: CarteDetailsComponent, data: { breadcrumb: { alias: 'Details' } } },
  { path: 'delivrer-carte', component: DelivrerCarteComponent, data: { breadcrumb: { alias: 'Délivrer' } } },
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class CarteRoutingModule { }
