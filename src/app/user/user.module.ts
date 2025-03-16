import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserDetailsComponent } from './user-details/user-details.component';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { UserComponent } from './user.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    UserComponent, 
    UserDetailsComponent,
    UserSettingsComponent,
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    UserRoutingModule
  ]
})
export class UserModule { }
