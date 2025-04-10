import { CoreModule } from './core/core.module';
import { HomeModule } from './home/home.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LoginComponent } from './resgiter/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthInterceptor } from './Interceptors/auth.interceptor';
import { BreadcrumbModule } from 'xng-breadcrumb';
import { RouterModule } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';

import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { TFBankComponent } from './tf-bank/tf-bank.component';
import { PackStudentComponent } from './pack-student/pack-student.component';
import { PackElyssaComponent } from './pack-elyssa/pack-elyssa.component';

//import { DemandesComponent } from './demandes/demandes.component';
//import { DemandeDecouvertComponent } from './demandes/demande-decouvert/demande-decouvert.component';

import { ReclamationComponent } from './reclamation/reclamation.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AccueilComponent,

    ResetPasswordComponent,
      TFBankComponent,
      PackStudentComponent,


      PackElyssaComponent,
      ReclamationComponent,  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgxSpinnerModule, FormsModule,
    BreadcrumbModule,
    AppRoutingModule,
    ReactiveFormsModule,


  ],
  providers: [
    //CookieService,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }// Ajouté pour gérer les cookies
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
