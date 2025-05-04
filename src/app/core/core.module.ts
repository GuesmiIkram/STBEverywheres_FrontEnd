import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent, UnreadNotificationsPipe } from './nav-bar/nav-bar.component';
import { SectionHeaderComponent } from './section-header/section-header.component';
import { BreadcrumbModule } from 'xng-breadcrumb';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    NavBarComponent,
    SectionHeaderComponent,
    UnreadNotificationsPipe
  ],
  imports: [
    CommonModule,
    BreadcrumbModule,RouterModule


  ],
  exports:[ NavBarComponent,
    SectionHeaderComponent]
})
export class CoreModule { }
