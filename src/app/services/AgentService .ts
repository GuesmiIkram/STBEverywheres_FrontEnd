import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environnement } from '../environnement/environnement';
import { ModificationRequest } from '../Models/ModificationRequest';

@Injectable({
  providedIn: 'root'
})
export class AgentService {
  private apiUrl = `${environnement.apiurl}/agent`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  getPendingModificationRequests(): Observable<ModificationRequest[]> {
    return this.http.get<ModificationRequest[]>(`${this.apiUrl}/modification-requests/pending`, {
      headers: this.getHeaders()
    });
  }

  downloadJustificationDocument(requestId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/modification-requests/${requestId}/document`, {
      headers: this.getHeaders(),
      responseType: 'blob'
    });
  }

  processModificationRequest(requestId: number, approve: boolean, comment?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/modification-requests/${requestId}/process`, {
      approve,
      comment
    }, {
      headers: this.getHeaders()
    });
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getAccessToken()}`
    });
  }
}