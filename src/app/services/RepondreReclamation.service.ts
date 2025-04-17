import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reclamation } from '../Models/Reclamation';import { environnement } from '../environnement/environnement';
;

@Injectable({
  providedIn: 'root',
})
export class RepondreReclamationService {
   private apiUrl = environnement.apiurl+"/agent"; //

  constructor(private http: HttpClient) {}

  getReclamationsEnAttente(): Observable<Reclamation[]> {
    return this.http.get<Reclamation[]>(`${this.apiUrl}/reclamations-en-attente`);
  }

  repondreAReclamation(dto: { Id: number; contenuReponse: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/repondre-reclamation`, dto);
  }
}
