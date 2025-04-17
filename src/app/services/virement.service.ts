import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Compte } from '../Models/compte';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { environnement } from '../environnement/environnement';

@Injectable({
  providedIn: 'root'
})
export class VirementService {


  private apiUrl = environnement.apiurl+"/virement";

  private apiCompteUrl =  environnement.apiurl+"/compte";

  constructor(private http: HttpClient, private AuthService: AuthService) { }

  // Récupérer la liste des comptes du client
  public getComptesClient(): Observable<Compte[]> {
    return this.http.get<Compte[]>(`${this.apiCompteUrl}/listecompteVirement`);
  }

  // Effectuer un virement
  effectuerVirement(virementData: any): Observable<any> {
    console.log('Envoi de la requête de virement avec les données :', virementData); 

    return this.http.post(`${this.apiUrl}/Virement`, virementData).pipe(
      tap(response => {
        console.log('Réponse du backend pour le virement :', response); 
      }),
      catchError(error => {
        console.error('Erreur lors de l\'appel API pour le virement :', error); 
        return throwError(error);
      })
    );
  }
 // Effectuer un virement de masse par formulaire 
  uploadVirementMasseForm(virementData: any): Observable<any> {
    console.log('Envoi de la requête de virement avec les données :', virementData); 

    return this.http.post(`${this.apiUrl}/VirementDeMasseForm`, virementData).pipe(
      tap(response => {
        console.log('Réponse du backend pour le virement :', response); 
      }),
      catchError(error => {
        console.error('Erreur lors de l\'appel API pour le virement :', error); 
        return throwError(error);
      })
    );
  }


uploadVirementMasseFile(formData: FormData): Observable<any> {
  const headers = new HttpHeaders({

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
