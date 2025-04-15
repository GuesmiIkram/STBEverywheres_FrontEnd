import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Compte } from '../Models/compte';
import { Client } from '../Models/Client';

import { DemandeModificationDecouvertDto } from '../Models/DemandeModificationDecouvertDto';

@Injectable({
  providedIn: 'root',
})
export class DecouvertService {
  private apiUrl = 'http://localhost:5185/api/Decouvert';
  private apiCompteUrl = 'http://localhost:5000/api/compte';
private apiClientUrl ='http://localhost:5000/api/client';

  constructor(private http: HttpClient) {}



   getClientInfo(): Observable<Client> {
     return this.http.get<Client>(`${this.apiClientUrl}/me`);
   }
  // Méthode pour récupérer les comptes (si vous avez un endpoint pour ça)
  getComptes(): Observable<any> {
    return this.http.get<Compte[]>(`${this.apiCompteUrl}/listecompteVirement`);
 // Remplacez par votre endpoint pour récupérer les comptes
  }
  // Méthode pour récupérer le découvert autorisé en fonction du RIB
  getDecouvertAutorise(rib: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/getDecouvertAutorise/${rib}`);
  }


 // Méthode pour envoyer une demande de modification du découvert
 demandeModificationDecouvert(demandeDto: DemandeModificationDecouvertDto): Observable<any> {
  return this.http.post(`${this.apiUrl}/demandeModificationDecouvert`, demandeDto);
}

getDemandesByClient(): Observable<DemandeModificationDecouvertDto[]> {
  return this.http.get<DemandeModificationDecouvertDto[]>(`${this.apiUrl}/getDemandesByClient`);
}


}
