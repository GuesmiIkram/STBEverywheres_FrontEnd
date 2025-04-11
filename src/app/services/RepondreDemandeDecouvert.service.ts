import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RepondreDemandeDecouvertService {
  private apiUrl = 'http://localhost:5117/api/agent';

  constructor(private http: HttpClient) { }

  getPendingDemands(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/demandes-en-attente`);
  }

  respondToDemand(response: { idDemande: string, accepte: boolean, motifRefus?: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/reponsedemandedecouvert`, response);
  }
}
