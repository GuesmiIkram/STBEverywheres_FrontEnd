import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
//import { environment } from 'src/environments/environment.development';
import { Compte } from '../Models/compte';
@Injectable({
  providedIn: 'root'
})
export class CompteService {

  constructor() { }


  private http = inject(HttpClient);
  //private apiUrl =environment.apiURL+'/api/CompteApi';
  private apiUrl = 'http://localhost:5185/api/CompteApi'; // URL du backend

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

}
