import { CarteRoutingModule } from './carte-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarteItemComponent } from './carte-item/carte-item.component';
import { CarteDetailsComponent } from './carte-details/carte-details.component';
import { CarteComponent } from './carte.component';
import { DelivrerCarteComponent } from './delivrer-carte/delivrer-carte.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    CarteComponent,
    CarteItemComponent,
    CarteDetailsComponent,
    DelivrerCarteComponent
  ],
  imports: [
    CommonModule,
    CarteRoutingModule,
    FormsModule
  ]
})
export class CarteModule { }
