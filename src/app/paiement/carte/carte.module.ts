import { CarteRoutingModule } from './carte-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarteItemComponent } from './carte-item/carte-item.component';
import { CarteDetailsComponent } from './carte-details/carte-details.component';
import { CarteComponent } from './carte.component';
import { DelivrerCarteComponent } from './delivrer-carte/delivrer-carte.component';



@NgModule({
  declarations: [
    CarteComponent,
    CarteItemComponent,
    CarteDetailsComponent,
    DelivrerCarteComponent
  ],
  imports: [
    CommonModule,
    CarteRoutingModule
  ]
})
export class CarteModule { }
