import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;

  constructor(private authService: AuthService, private router: Router) {}
// Dans votre intercepteur
private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json' // Ajoutez ceci si nécessaire
    }
  });
}

intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  // Ne pas ajouter le token pour les routes d'authentification
  if (req.url.includes('/login') || req.url.includes('/refresh')) {
    return next.handle(req);
  }

  const token = this.authService.getAccessToken();
  
  if (token) {
    const authReq = this.addToken(req, token);
    console.log('Request headers with token:', authReq.headers); // Vérifiez ici
    return next.handle(authReq);
  }

  return next.handle(req);
}}