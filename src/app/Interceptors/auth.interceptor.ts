import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;

  constructor(private authService: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // 1. Ne pas modifier les requêtes d'authentification
    if (req.url.includes('/login') || req.url.includes('/refresh')) {
      return next.handle(req);
    }

    const token = this.authService.getAccessToken();

    // 2. Si pas de token, on laisse passer la requête
    /*if (!token) {
      return next.handle(req);
    }*/

    // 3. Gestion spéciale pour FormData
    if (req.body instanceof FormData) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
          // Content-Type sera géré automatiquement
        }
      });
      console.log('FormData request with token:', authReq.headers);
      return next.handle(authReq);
    }

    // 4. Pour toutes les autres requêtes (JSON)
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('JSON request with token:', authReq.headers);
    return next.handle(authReq);
  }
}

import { catchError, Observable, tap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  // Dans votre intercepteur (auth.interceptor.ts)
intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  // Ne pas modifier les requêtes d'authentification
  if (req.url.includes('/login') || req.url.includes('/refresh')) {
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
