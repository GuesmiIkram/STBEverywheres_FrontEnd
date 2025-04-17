import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaBanqueRoutingModule } from './ma-banque-routing.module';
import { DecouvertComponent } from './decouvert/decouvert.component';
import { FormsModule } from '@angular/forms'; 
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DecouvertComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaBanqueRoutingModule
  ]
})
export class MaBanqueModule { }
