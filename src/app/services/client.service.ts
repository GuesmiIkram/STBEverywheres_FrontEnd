import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Client } from '../Models/Client';
 // Importation du modèle

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  
  //private apiUrl = 'http://localhost:5260/api/client'; // URL du backend
  private apiUrl ='http://localhost:5000/api/client';
  constructor(private http: HttpClient) {}

  // Récupérer les infos du client
  getClientInfo(): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/me`);
  }

  // Mettre à jour les infos du client
  updateClientInfo(client: Client): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}/update`, client);
  }
  downloadKYC(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/kyc/download`, { responseType: 'blob' });
  }
  uploadProfileImage(clientId: number, formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/upload-profile-image`, formData);
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
  // Supprimer la photo de profil
  removeProfileImage(clientId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/remove-profile-image`);
  }
}
