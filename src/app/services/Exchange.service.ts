// chatbot.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExchangeRate } from '../Models/ExchangeRate';
import { environnement } from '../environnement/environnement';

@Injectable({
  providedIn: 'root'
})
export class ExchangeService {
  private apiUrl = environnement.apiurl + "/Exchange";

  constructor(private http: HttpClient) {}

  GetExchangeRates(): Observable<ExchangeRate[]> {
    return this.http.get<ExchangeRate[]>(`${this.apiUrl}/ExchangerRates`);
  }

  convertir(requestBody: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/Convertir`, requestBody);
}

}



