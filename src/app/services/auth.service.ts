import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, throwError, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/Auth';

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
  // Login method
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response: any) => {
        console.log('Réponse de login du backend', response);

        // Utilisez les mêmes noms de propriétés que la réponse (minuscules)
        this.setTokens(response.token, response.refreshToken); // minuscules

        console.log('userRole:', response.role); // minuscule
        console.log('userId:', response.userId); // minuscule

        if (response.role) {
          localStorage.setItem('userRole', response.role);
        }
        if (response.userId) {
          localStorage.setItem('userId', response.userId.toString());
        }
        if (response.clientId) {
          localStorage.setItem('clientId', response.clientId.toString());
        }
        if (response.agentId) {
          localStorage.setItem('agentId', response.agentId.toString());
        }
      }),
      catchError((error) => {
        console.error('Login error:', error);
        return throwError(() => new Error(error.error?.message || 'Identifiants incorrects'));
      })
    );
  }
/*
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response: any) => {
        console.log('REsonse de login de back', response);
        this.setTokens(response.Token, response.RefreshToken);
        // Stocker les informations utilisateur dont le rôle
        console.log('userRole', response.Role);
        console.log('userId', response.UserId);
        localStorage.setItem('userRole', response.Role);
        localStorage.setItem('userId', response.UserId);
        if (response.ClientId) {
          console.log('clientId', response.clientId);

          localStorage.setItem('clientId', response.ClientId);
        }
        if (response.AgentId) {
          console.log('agentId', response.agentId);

          localStorage.setItem('agentId', response.AgentId);
        }
      }),
      catchError((error) => {
        console.error('Login error:', error);
        return throwError(() => new Error(error.error?.message || 'Identifiants incorrects'));
      })
    );
  }
*/
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

  // Refresh token method
  refreshToken(): Observable<any> {
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
    localStorage.removeItem('AccessToken');
    localStorage.removeItem('RefreshToken');
    this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => console.error('Logout error:', err)
    });
  }

  // Helper method to set tokens
  private setTokens(accessToken: string, refreshToken?: string): void {
    localStorage.setItem('AccessToken', accessToken);
    if (refreshToken) {
      localStorage.setItem('RefreshToken', refreshToken);
    }
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

}
