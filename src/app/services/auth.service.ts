import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, throwError, tap } from 'rxjs';

import { environnement } from '../environnement/environnement';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environnement.apiurl+"/Auth";

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}
 forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email }).pipe(
      catchError((error) => {
        console.error('Forgot password error:', error);
        return throwError(() => new Error(error.error?.message || 'Erreur lors de la demande de réinitialisation'));
      })
    );
  }

  // Méthode pour réinitialiser le mot de passe
  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, {
      token,
      newPassword
    }).pipe(
      catchError((error) => {
        console.error('Reset password error:', error);
        return throwError(() => new Error(error.error?.message || 'Erreur lors de la réinitialisation'));
      })
    );
  }
login(email: string, password: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
    tap((response: any) => {
      console.log('Réponse de login du backend', response);
      this.setTokens(response.token, response.refreshToken);
      
      if (response.role) localStorage.setItem('userRole', response.role);
      if (response.userId) localStorage.setItem('userId', response.userId.toString());
      if (response.clientId) localStorage.setItem('clientId', response.clientId.toString());
      if (response.agentId) localStorage.setItem('agentId', response.agentId.toString());
    }),
    catchError((error) => {
      console.error('Erreur complète de login:', error); // Debug important
      // Transmet TOUTE l'erreur au lieu de créer une nouvelle erreur
      return throwError(() => ({
        ...error,
        originalError: error.error // Conservation de la structure originale
      }));
    })
  );
}
getUserRole(): string {
  return localStorage.getItem('userRole') || '';
}

getUserId(): number | null {
  const userId = localStorage.getItem('userId');
  return userId ? parseInt(userId) : null;
}

  isAgent(): boolean {
    return this.getUserRole() === 'Agent';
  }

  isClient(): boolean {
    return this.getUserRole() === 'Client';
  }



  /*login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response: any) => {
        this.setTokens(response.token, response.refreshToken);
      }),
      catchError((error) => {
        console.error('Login error:', error);
        return throwError(() => new Error(error.error?.message || 'Identifiants incorrects'));
      })
    );
  }*/

  // Get access token from local storage
  getAccessToken(): string | null {
    return localStorage.getItem('AccessToken');
  }


  // Dans votre AuthService, modifiez la méthode refreshToken comme suit :
refreshToken(): Observable<any> {
  const refreshToken = localStorage.getItem('RefreshToken');
  if (!refreshToken) {
    this.logout();
    return throwError(() => new Error('No refresh token available'));
  }

  return this.http.post(`${this.apiUrl}/refresh-token`, {}, { withCredentials: true }).pipe(
    tap((response: any) => {
      if (response?.accessToken) {
        this.setTokens(response.accessToken, response.refreshToken);
      }
    }),
    catchError((error) => {
      console.error('Refresh token error:', error);
      this.logout();
      return throwError(() => error);
    })
  );
}

  // Logout method
  logout(): void {
  
    this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).subscribe({
        next: () => {
     
            localStorage.removeItem('AccessToken');
            localStorage.removeItem('RefreshToken');
            localStorage.clear();
            this.router.navigate(['']);
        },
        error: (err) => {
            console.error('Logout error:', err);
         
            localStorage.removeItem('AccessToken');
            localStorage.removeItem('RefreshToken');
            localStorage.clear();
            this.router.navigate(['']);
        }
    });
}

  private setTokens(accessToken: string, refreshToken?: string): void {
    localStorage.setItem('AccessToken', accessToken);
    if (refreshToken) {
      localStorage.setItem('RefreshToken', refreshToken);
    }
  }

  isLoggedIn(): boolean {
    // Exemple basique - adaptez à votre logique
    return !!localStorage.getItem('AccessToken'); // ou autre méthode de vérification
  }

}
