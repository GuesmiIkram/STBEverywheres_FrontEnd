import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, throwError, tap, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5260/api/Auth';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  // Méthode pour se connecter
  login(email: string, password: string): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/login`, { email, password },{ withCredentials: true })
      .pipe(
        tap(() => {
          console.log('Connexion réussie, récupération des tokens...');
        }),
        catchError((error) => {
          console.error('Erreur lors de la connexion :', error);
          return throwError(() => new Error('Identifiants incorrects'));
        })
      );
  }


  getTokens(): Observable<any> {
    return this.http.get(`${this.apiUrl}/tokens`,{ withCredentials: true }).pipe(
      tap((response: any) => {
        console.log(' Tokens récupérés depuis le backend :', response);
        console.log('📝 Token reçu:', response.accessToken);
        localStorage.setItem('AccessToken', response.accessToken);
        localStorage.setItem('RefreshToken', response.refreshToken);
      }),
      catchError((error) => {
        console.error(' Erreur lors de la récupération des tokens :', error);
        return throwError(() => new Error('Erreur lors de la récupération des tokens'));
      })
    );
  }
  refreshToken(): Observable<any> {
    return this.http.post(`${this.apiUrl}/refresh-token`, {}).pipe(
      tap((response: any) => {
        console.log(' Token rafraîchi avec succès', response);
        localStorage.setItem('AccessToken', response.accessToken);
        localStorage.setItem('RefreshToken', response.refreshToken);
      }),
      catchError((error) => {
        console.error(' Erreur lors du rafraîchissement du token', error);
        this.logout();
        return throwError(() => new Error('Session expirée, veuillez vous reconnecter.'));
      })
    );
  }
  
  

 
  isLoggedIn(): Observable<boolean> {
    const accessToken = localStorage.getItem('AccessToken');
    return of(!!accessToken); 
  }

  
  logout(): void {
    localStorage.removeItem('AccessToken');
    localStorage.removeItem('RefreshToken');
    this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).subscribe(() => {
      this.router.navigate(['/login']);
    });
  }


  getAccessToken(): string | null {
    return localStorage.getItem('AccessToken');
  }
}