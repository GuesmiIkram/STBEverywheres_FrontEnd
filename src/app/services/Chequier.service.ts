// chequier.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environnement } from '../environnement/environnement';

@Injectable({
  providedIn: 'root'
})
export class ChequierService {
  private apiChequierUrl = environnement.apiurl+"/ChequierApi";

  constructor(private http: HttpClient) { }

  getChequesParClient(): Observable<any> {
    return this.http.get(`${this.apiChequierUrl}/cheques`);
  }

  getFeuillesParChequier(numeroChequier: string): Observable<any> {
    return this.http.get(`${this.apiChequierUrl}/feuilles/${numeroChequier}`);
  }


}
