
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgenceService {
  // private apiUrl = environnement.apiurl + "/AgenceApi";

  private apiUrl = 'http://localhost:5036/api/AgenceApi';

  constructor(private http: HttpClient) { }

  getAgences(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
