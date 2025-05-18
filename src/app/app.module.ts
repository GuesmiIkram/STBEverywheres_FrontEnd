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
import { RouterModule } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';

import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { TFBankComponent } from './tf-bank/tf-bank.component';
import { PackStudentComponent } from './pack-student/pack-student.component';
import { PackElyssaComponent } from './pack-elyssa/pack-elyssa.component';

//import { DemandesComponent } from './demandes/demandes.component';
//import { DemandeDecouvertComponent } from './demandes/demande-decouvert/demande-decouvert.component';

import { ReclamationComponent } from './reclamation/reclamation.component';
import { SimulateurCreditComponent } from './simulateur-credit/simulateur-credit.component';
import { ReponseReclamationComponent } from './reponse-reclamation/reponse-reclamation.component';
import { RibIbanComponent } from './rib-iban/rib-iban.component';
import { HistoriqueReclamationsComponent } from './historique-reclamations/historique-reclamations.component';
import { KycDownloadComponent } from './kyc-download/kyc-download.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';




import { ExtraitComponent } from './extrait/extrait.component';
//import { DashbordAgentComponent } from './dashbord-agent/dashbord-agent.component';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr)

import { BreadcrumbModule } from 'xng-breadcrumb';
import { NgChartsModule } from 'ng2-charts';
import { ModificationRequestsComponent } from './modification-requests/modification-requests.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AccueilComponent,

    ResetPasswordComponent,
      TFBankComponent,
      PackStudentComponent,


      PackElyssaComponent,
      ReclamationComponent,
      SimulateurCreditComponent,
      ReponseReclamationComponent,
      RibIbanComponent,
      HistoriqueReclamationsComponent,
       KycDownloadComponent,
      ExtraitComponent,
      ModificationRequestsComponent,
      VerifyEmailComponent,
      //DashbordAgentComponent,
     ],





  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgxSpinnerModule, FormsModule,
    BreadcrumbModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgChartsModule,


     MatFormFieldModule,
    MatSelectModule


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
