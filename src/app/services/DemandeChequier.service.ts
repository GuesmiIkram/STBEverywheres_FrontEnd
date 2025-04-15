// chequier.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Compte } from '../Models/compte';


@Injectable({
  providedIn: 'root'
})
export class DemandeChequierService {
  private apiDemandeChequierUrl = 'http://localhost:5264/api/DemandeChequierApi';
  private apiCompteUrl = 'http://localhost:5000/api/compte';

  constructor(private http: HttpClient) { }

  getComptesClient(): Observable<Compte[]> {
    return this.http.get<Compte[]>(`${this.apiCompteUrl}/listecompteVirement`);
  }
  demanderChequierBarre(demande: any): Observable<any> {
    return this.http.post(`${this.apiDemandeChequierUrl}/DemandeChequierBarre`, demande);
  }

  demanderChequierNonBarre(demande: any): Observable<any> {
    return this.http.post(`${this.apiDemandeChequierUrl}/DemandeChequierNonBarre`, demande);
  }

  getDemandesParClient(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiDemandeChequierUrl}/ListeDemandesParClient`);
  }




}
