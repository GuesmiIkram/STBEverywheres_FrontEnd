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
import { FormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthInterceptor } from './Interceptors/auth.interceptor';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgxSpinnerModule, FormsModule,
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
