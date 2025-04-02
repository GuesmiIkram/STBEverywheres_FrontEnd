import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DecouvertComponent } from './../ma-banque/decouvert/decouvert.component';

const routes: Routes = [
  { path: 'decouvert', component: DecouvertComponent }  // Ajout de la route


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaBanqueRoutingModule { }


















