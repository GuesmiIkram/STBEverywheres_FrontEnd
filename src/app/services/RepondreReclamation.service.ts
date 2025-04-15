import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reclamation } from '../Models/Reclamation';;

@Injectable({
  providedIn: 'root',
})
export class RepondreReclamationService {
  private apiUrl = 'http://localhost:5117/api/agent/'; // Ajuste l'URL si besoin

  constructor(private http: HttpClient) {}

  getReclamationsEnAttente(): Observable<Reclamation[]> {
    return this.http.get<Reclamation[]>(`http://localhost:5117/api/agent/reclamations-en-attente`);
  }

  repondreAReclamation(dto: { Id: number; contenuReponse: string }): Observable<any> {
    return this.http.post(`http://localhost:5117/api/agent/repondre-reclamation`, dto);
  }
}
