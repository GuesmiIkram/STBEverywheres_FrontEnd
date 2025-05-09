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
    return this.http.get<StatDemandeChequier>('http://localhost:5117/api/agent/statistiques-agent');
  }

  getStatsDecouvert(): Observable<StatDemandeDecouvert> {
    return this.http.get<StatDemandeDecouvert>('http://localhost:5117/api/agent/statistiques-demandes-decouvert');
  }


  getStatsReclamation(): Observable<StatReclamation> {
    return this.http.get<StatReclamation>('http://localhost:5117/api/agent/statistiques-reclamations');
  }
  getStatsKYC(): Observable<StatKYC> {
    return this.http.get<StatKYC>('http://localhost:5117/api/agent/statistiques-KYC');
  }

}
