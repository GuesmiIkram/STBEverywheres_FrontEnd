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
        this.setTokens(response.token, response.refreshToken);
      }),
      catchError((error) => {
        console.error('Login error:', error);
        return throwError(() => new Error(error.error?.message || 'Identifiants incorrects'));
      })
    );
  }

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
  register(registerData: { rib: string, email: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, registerData).pipe(
      tap(() => {
        console.log('Inscription réussie.');
      }),
      catchError((error) => {
        console.error('Erreur lors de l\'inscription :', error);

        // Extraire le message d'erreur du backend
        const errorMessage = error.error?.message || 'Erreur lors de l\'inscription';

        // Renvoyer l'erreur avec le message du backend
        return throwError(() => ({ message: errorMessage }));
      })
    );
  }
}