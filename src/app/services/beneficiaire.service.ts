import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Beneficiaire } from '../Models/Beneficiaire';
import { environnement } from '../environnement/environnement';

@Injectable({
  providedIn: 'root',
})
export class BeneficiaireService {
  private apiUrl = environnement.apiurl+"/Beneficiaire";

  constructor(private http: HttpClient) {}

  createBeneficiaire(beneficiaire: Beneficiaire): Observable<any> {
    return this.http.post(`${this.apiUrl}/CreateBeneficiaire`, beneficiaire);
  }

  getBeneficiairesByClientId(): Observable<Beneficiaire[]> {
    return this.http.get<Beneficiaire[]>(`${this.apiUrl}/GetBeneficiairesByClientId`);
  }



}
