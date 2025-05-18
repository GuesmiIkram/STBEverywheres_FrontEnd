// chequier.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Compte } from '../Models/compte';
import { environnement } from '../environnement/environnement';
import { StatDemandeChequier } from '../Models/StatDemandeChequier';
import { StatDemandeDecouvert } from '../Models/StatDemandeDecouvert';
import { StatReclamation } from '../Models/StatReclamation';
import { StatKYC } from '../Models/StatKYC';


@Injectable({
  providedIn: 'root'
})
export class DemandeChequierStatService {
  private api =  environnement.apiurl+"/agent";

  constructor(private http: HttpClient) { }


  getStatistiquesDemandeChequier(): Observable<StatDemandeChequier> {
    return this.http.get<StatDemandeChequier>(`${this.api}/statistiques-agent`);
     
  }

  getStatsDecouvert(): Observable<StatDemandeDecouvert> {
    return this.http.get<StatDemandeDecouvert>(`${this.api}/statistiques-demandes-decouvert`);
  }


  getStatsReclamation(): Observable<StatReclamation> {
    return this.http.get<StatReclamation>(`${this.api}/statistiques-reclamations`);
  }
  getStatsKYC(): Observable<StatKYC> {
    return this.http.get<StatKYC>(`${this.api}/statistiques-KYC`);
  }

}
