import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';







import { catchError, Observable, tap, throwError } from 'rxjs';

import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}



  // Dans votre intercepteur (auth.interceptor.ts)
intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  // Ne pas modifier les requêtes d'authentification
  if (req.url.includes('/login') || req.url.includes('/refresh')|| req.url.includes('/GetByRIB')) {
    return next.handle(req);
  }

  const token = this.authService.getAccessToken();
  if (!token) return next.handle(req);

  // Clone la requête en ajoutant les headers nécessaires
  let authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
      // Header optionnel pour les requêtes FormData
      ...(req.body instanceof FormData && { 'Accept': 'application/json' })
    }
  });

  return next.handle(authReq);
}}

