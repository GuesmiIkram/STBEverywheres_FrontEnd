import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';





interface ReclamationDto {
    objet: string;
    description: string;
  }

  interface ReclamationResponse {
    id: number;
    objet: string;
    description: string;
    dateCreation: string;
    statut: string;
    reference: string;
  }

  @Injectable({
    providedIn: 'root'
  })
  export class ReclamationService {

    private apiUrl = 'http://localhost:5000/api/Reclamation';
    constructor(private http: HttpClient) { }

    /*createReclamation(reclamationData: ReclamationDto): Observable<ReclamationResponse> {
      return this.http.post<ReclamationResponse>(
        `${this.apiUrl}/effectuer-reclamation`,
        reclamationData
      );
    }
  }*/
  createReclamation(reclamationData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/effectuer-reclamation`, reclamationData);
  }}
