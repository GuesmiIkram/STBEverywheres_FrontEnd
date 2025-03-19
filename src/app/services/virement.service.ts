import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Compte } from '../Models/compte';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VirementService {

  private apiUrl = 'http://localhost:5185/api/VirementApi';
  private apiCompteUrl = 'http://localhost:5185/api/CompteApi';

  constructor(private http: HttpClient) { }

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


  // Fonction pour envoyer le fichier au serveur
  uploadVirementMasse(formData: FormData): Observable<any> {

    return this.http.post(`${this.apiUrl}/VirementDeMasse`, formData);

    }

}
