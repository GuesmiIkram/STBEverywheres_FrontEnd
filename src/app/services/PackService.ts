import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PackService {
  private apiUrl = 'http://localhost:5117/api/agent/packs'; 

  constructor(private http: HttpClient) { }

  // Récupérer les demandes de pack étudiant par agence
  getStudentDemandsByAgency(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/student-demands`);
  }

  // Récupérer les demandes de pack elyssa par agence
  getElyssaDemandsByAgency(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/elyssa-demands`);
  }

  // Accepter une demande de pack étudiant
  acceptStudentDemand(demandId: number): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/student-demands/${demandId}/accept`, 
      {}
    );
  }

  // Accepter une demande de pack elyssa
  acceptElyssaDemand(demandId: number): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/elyssa-demands/${demandId}/accept`, 
      {}
    );
  }


  // Refuser une demande de pack étudiant
  refuseStudentDemand(demandId: number): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/student-demands/${demandId}/refuse`,
      {}
    );
  }

  // Refuser une demande de pack elyssa
  refuseElyssaDemand(demandId: number): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/elyssa-demands/${demandId}/refuse`,
      {}
    );
  }

  // Générer le PDF pour une demande de pack étudiant
  generateStudentPdf(demandId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/student-demands/${demandId}/generate-pdf`, {
      responseType: 'blob'
    });
  }

  // Générer le PDF pour une demande de pack elyssa
  generateElyssaPdf(demandId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/elyssa-demands/${demandId}/generate-pdf`, {
      responseType: 'blob'
    });
  }
}