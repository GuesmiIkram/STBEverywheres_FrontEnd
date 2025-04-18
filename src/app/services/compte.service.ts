import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
//import { environment } from 'src/environments/environment.development';
import { Compte } from '../Models/compte';
import { environnement } from '../environnement/environnement';
@Injectable({
  providedIn: 'root'
})
export class CompteService {

  constructor() { }


  private http = inject(HttpClient);
 
  private apiUrl = environnement.apiurl+"/compte";
  private apiRibIbanUrl =environnement.apiurl+"/compte";
  /*public getComptesByCin(): Observable<Compte[]> {
    const token = localStorage.getItem('token'); // Récupérer le token stocké
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<Compte[]>(`${this.apiUrl}/listecompte`, { headers });
  }*/
  public getComptesByCin(): Observable<Compte[]> {


    return this.http.get<Compte[]>(`${this.apiUrl}/listecompte`);
  }
  createCompte(compteDto: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/CreateCompte`, compteDto);
  }
  /*getCompteByRib(rib: string): Observable<Compte> {
    return this.http.get<Compte>(`${this.apiUrl}/GetByRIB/${rib}`);
  }*/
    getCompteByRib(rib: string): Observable<Compte> {
      return this.http.get<Compte>(`${this.apiUrl}/GetByRIB/${rib}`).pipe(
        tap((data) => console.log("Réponse API :", data)) // Vérifiez si les valeurs sont présentes
      );
    }


  cloturerCompte(rib: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/Cloturer/${rib}`, {});
  }


  public downloadRIB(rib: string): Observable<Blob> {
    return this.http.get(`${this.apiRibIbanUrl}/rib/download?rib=${rib}`, {
      responseType: 'blob',
      headers: new HttpHeaders({
        'Accept': 'application/pdf'
      })
    });
  }


}
