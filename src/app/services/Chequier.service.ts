// chequier.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChequierService {
  private apiChequierUrl = 'http://localhost:5264/api/ChequierApi';

  constructor(private http: HttpClient) { }

  getChequesParClient(): Observable<any> {
    return this.http.get(`${this.apiChequierUrl}/cheques`);
  }

  getFeuillesParChequier(numeroChequier: string): Observable<any> {
    return this.http.get(`${this.apiChequierUrl}/feuilles/${numeroChequier}`);
  }


}
