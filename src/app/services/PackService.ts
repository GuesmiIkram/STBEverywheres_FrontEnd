import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environnement } from '../environnement/environnement';

@Injectable({
  providedIn: 'root'
})
export class PackService {
  private apiUrl = environnement.apiurl+"/agent/packs"; 

  constructor(private http: HttpClient) { }

  // Récupérer les demandes de pack étudiant par agence
  getStudentDemandsByAgency(): Observable<any> {
    return this.http.get<any>(`http://localhost:5000/api/agent/packs/student-demands`);
  }

  // Récupérer les demandes de pack elyssa par agence
  getElyssaDemandsByAgency(): Observable<any> {
    return this.http.get<any>(`http://localhost:5000/api/agent/packs/elyssa-demands`);
  }

  // Accepter une demande de pack étudiant
  acceptStudentDemand(demandId: number): Observable<any> {
    return this.http.post<any>(
      `http://localhost:5000/api/agent/packs/student-demands/${demandId}/accept`, 
      {}
    );
  }

  // Accepter une demande de pack elyssa
  acceptElyssaDemand(demandId: number): Observable<any> {
    return this.http.post<any>(
      `http://localhost:5000/api/agent/packs/elyssa-demands/${demandId}/accept`, 
      {}
    );
  }


  // Refuser une demande de pack étudiant
  refuseStudentDemand(demandId: number): Observable<any> {
    return this.http.post<any>(
      `http://localhost:5000/api/agent/packs/student-demands/${demandId}/refuse`,
      {}
    );
  }

  // Refuser une demande de pack elyssa
  refuseElyssaDemand(demandId: number): Observable<any> {
    return this.http.post<any>(
      `http://localhost:5000/api/agent/packs/elyssa-demands/${demandId}/refuse`,
      {}
    );
  }

  // Générer le PDF pour une demande de pack étudiant
  generateStudentPdf(demandId: number): Observable<Blob> {
    return this.http.get(`http://localhost:5000/api/agent/packs/student-demands/${demandId}/generate-pdf`, {
      responseType: 'blob'
    });
  }

  // Générer le PDF pour une demande de pack elyssa
  generateElyssaPdf(demandId: number): Observable<Blob> {
    return this.http.get(`http://localhost:5000/api/agent/packs/elyssa-demands/${demandId}/generate-pdf`, {
      responseType: 'blob'
    });
  }
}