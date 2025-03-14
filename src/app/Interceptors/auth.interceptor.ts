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

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = this.addToken(req, this.authService.getAccessToken());

    return next.handle(authReq).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401 && !this.isRefreshing) {
          return this.handle401Error(req, next);
        }
        return throwError(() => error);
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string | null) {
    if (token) {
      return request.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }
    return request;
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.isRefreshing = true;

    return this.authService.refreshToken().pipe(
      switchMap((newToken) => {
        this.isRefreshing = false;
        return next.handle(this.addToken(request, newToken.AccessToken));
      }),
      catchError((error) => {
        this.isRefreshing = false;
        this.authService.logout(); // Déconnexion en cas d'échec
        return throwError(() => error);
      })
    );
  }
}
