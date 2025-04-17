import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Compte } from '../Models/compte';
import { Client } from '../Models/Client';

import { DemandeModificationDecouvertDto } from '../Models/DemandeModificationDecouvertDto';
import { environnement } from '../environnement/environnement';

@Injectable({
  providedIn: 'root',
})
export class DecouvertService {
  private apiUrl = environnement.apiurl+"/Decouvert";
  private apiCompteUrl = environnement.apiurl+"/compte";
  private apiClientUrl =environnement.apiurl+"/client";

  constructor(private http: HttpClient) {}



   getClientInfo(): Observable<Client> {
     return this.http.get<Client>(`${this.apiClientUrl}/me`);
   }
  // Méthode pour récupérer les comptes 
  getComptes(): Observable<any> {
    return this.http.get<Compte[]>(`${this.apiCompteUrl}/listecompteVirement`);
 
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
