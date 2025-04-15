import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DemandeChequier } from 'src/app/Models/DemandeChequier';

@Injectable({
  providedIn: 'root'
})
export class RepondreDemandeChequierService {
  private baseUrl = 'http://localhost:5117/api/agent';

  constructor(private http: HttpClient) {}

  getDemandesEnAttente(): Observable<DemandeChequier[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });

    return this.http.get<DemandeChequier[]>(
      `${this.baseUrl}/demandesChequier-en-attente`,
      { headers }
    );
  }

  changerStatutDemande(idDemande: number, nouveauStatut: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });

    return this.http.put(
      `${this.baseUrl}/changer-statut-demande/${idDemande}?nouveauStatut=${nouveauStatut}`,
      null,
      { headers }
    );
  }


  getDemandesParRib(rib: string): Observable<DemandeChequier[]> {
    const url = `${this.baseUrl}/demandes-chequiers-par-rib?rib=${encodeURIComponent(rib)}`;
    return this.http.get<DemandeChequier[]>(url);
  }

}
