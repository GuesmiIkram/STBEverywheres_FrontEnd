import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Compte } from '../Models/compte';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class VirementService {

  //private apiUrl = 'http://localhost:5185/api/VirementApi';
  private apiUrl ='http://localhost:5000/api/virement';
  //private apiCompteUrl = 'http://localhost:5185/api/CompteApi';
  private apiCompteUrl = 'http://localhost:5000/api/compte';

  constructor(private http: HttpClient, private AuthService: AuthService) { }

  // Récupérer la liste des comptes du client
  public getComptesClient(): Observable<Compte[]> {
    return this.http.get<Compte[]>(`${this.apiCompteUrl}/listecompteVirement`);
  }

  // Effectuer un virement
  effectuerVirement(virementData: any): Observable<any> {
    console.log('Envoi de la requête de virement avec les données :', virementData); // Log avant l'envoi HTTP

    return this.http.post(`${this.apiUrl}/Virement`, virementData).pipe(
      tap(response => {
        console.log('Réponse du backend pour le virement :', response); // Log de la réponse de l'API
      }),
      catchError(error => {
        console.error('Erreur lors de l\'appel API pour le virement :', error); // Log d'erreur API
        return throwError(error);
      })
    );
  }

  uploadVirementMasseForm(virementData: any): Observable<any> {
    console.log('Envoi de la requête de virement avec les données :', virementData); // Log avant l'envoi HTTP

    return this.http.post(`${this.apiUrl}/VirementDeMasseForm`, virementData).pipe(
      tap(response => {
        console.log('Réponse du backend pour le virement :', response); // Log de la réponse de l'API
      }),
      catchError(error => {
        console.error('Erreur lors de l\'appel API pour le virement :', error); // Log d'erreur API
        return throwError(error);
      })
    );
  }

  // Fonction pour envoyer le fichier au serveur
 /* uploadVirementMasse(formData: FormData): Observable<any> {

    return this.http.post(`${this.apiUrl}/VirementDeMasse`, formData);

    }
*/
uploadVirementMasseFile(formData: FormData): Observable<any> {
  const headers = new HttpHeaders({
    // Ne pas définir Content-Type, le navigateur le fera automatiquement
    'Authorization': `Bearer ${this.AuthService.getAccessToken}`
  });

  return this.http.post(`${this.apiUrl}/VirementDeMasseFile`, formData, {
    headers: headers,
    reportProgress: true
  });
}
    getHistoriqueVirements(rib: string, filter: string) {

      return this.http.get(`${this.apiUrl}/historiqueVirements/${rib}?filter=${filter}`);
    }

}
