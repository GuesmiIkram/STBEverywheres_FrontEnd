import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Beneficiaire } from '../Models/Beneficiaire';
 // Importation du modèle

@Injectable({
  providedIn: 'root',
})
export class BeneficiaireService {

  private apiUrl ='http://localhost:5260/api/client';
  constructor(private http: HttpClient) {}

  // Récupérer les infos du client
  CreateBeneficiaire(Beneficiaire:any): Observable<any> {
    return this.http.post(`${this.apiUrl}/CreateBeneficiaire`, Beneficiaire);
  }


}
