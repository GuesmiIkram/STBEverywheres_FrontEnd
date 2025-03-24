import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '../Models/Client';
 // Importation du modèle

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  //private apiUrl = 'http://localhost:5260/api/client'; // URL du backend
  private apiUrl ='http://localhost:5260/api/client';
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

  // Supprimer la photo de profil
  removeProfileImage(clientId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/remove-profile-image`);
  }
}
