import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DemandePlafondService {
  private apiUrl = 'http://localhost:5117/api/agent'; 

  constructor(private http: HttpClient) { }

  getPendingDemands(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/demandes-plafond-en-attente`);
  }

  respondToDemand(dto: { 
    demandeId: number; 
    nouveauStatut: 'Approuvee' | 'Rejetee'; 
    commentaire?: string 
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/repondre-demande-plafond`, dto);
  }
  getCardDemandsByAgency(): Observable<any> {
    return this.http.get(`${this.apiUrl}/demandes-carte/by-agence`);
  }

  updateCardDemandStatus(demandeId: number, updateDto: { 
    nouveauStatut: number; 
    commentaire?: string 
  }): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/demandes-carte/${demandeId}/statut`,
      updateDto
    );
  }
}