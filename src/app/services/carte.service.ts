import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CarteDTO } from '../Models/CarteDTO'; // Assurez-vous d'avoir un modèle CarteDTO
import { map } from 'rxjs/operators';
import { NomCarte } from '../enums/nom-carte.enum';
import { TypeCarte } from '../enums/type-carte.enum';
import { StatutCarte } from '../enums/statut-carte.enum';
import { DemandeCarte } from '../Models/DemandeCarte';
import { DemandeAugmentationPlafondDTO } from '../Models/DemandeAugmentationPlafondDTO ';
import { RechargeCarteDTO } from '../Models/RechargeCarteDTO';
import { HistoriqueRechargeDto } from '../Models/HistoriqueRechargeDto';
import { environnement } from '../environnement/environnement';
@Injectable({
  providedIn: 'root',
})
export class CarteService {
 
 private apiUrl = environnement.apiurl+"/carte";
  constructor(private http: HttpClient) {}

  getCartesByClientId(): Observable<CarteDTO[]> {
    return this.http.get<CarteDTO[]>(`${this.apiUrl}/cartes/by-client`).pipe(
      map(cartes => cartes.map(carte => ({
        ...carte,
        nomCarte: NomCarte[carte.nomCarte as keyof typeof NomCarte], 
        typeCarte: TypeCarte[carte.typeCarte as keyof typeof TypeCarte], 
        statut: StatutCarte[carte.statut as keyof typeof StatutCarte] 
      })))
    );
  }

  getCarteDetails(numCarte: string): Observable<CarteDTO> {
    return this.http.get<CarteDTO>(`${this.apiUrl}/details/${numCarte}`);
  }

  blockCarte(numCarte: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/block/${numCarte}`, {});
  }

  deblockCarte(numCarte: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/deblock/${numCarte}`, {});
  }
   // Méthode pour créer une demande de carte
   createDemandeCarte(demandeCarte: DemandeCarte): Observable<any> {
    return this.http.post(`${this.apiUrl}/demande`, demandeCarte);
  }

  createDemandeCartePrepayee(demande: DemandeCarte): Observable<any> {
    return this.http.post(`${this.apiUrl}/demande-prepayee`, demande);
  }
  createDemandeAugmentation(demande: DemandeAugmentationPlafondDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/demande-augmentation`, demande);
  }

  /**
   * Récupère les demandes d'augmentation de plafond pour le client connecté
   */
  getDemandesAugmentation(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/demandes-augmentation`);
  }
  rechargerCarte(data: RechargeCarteDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/effectuer-recharge`, data);
  }

  getHistorique(): Observable<HistoriqueRechargeDto[]> {
    return this.http.get<any[]>(`${this.apiUrl}/historique-recharges`);
  }
}
