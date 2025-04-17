import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotificationReclamation } from '../Models/NotificationReclamation';
import { AuthService } from './auth.service';
import { environnement } from '../environnement/environnement';





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

     private apiUrl = environnement.apiurl+"/Reclamation";
    constructor(private http: HttpClient,private authService :AuthService) { }

  

//reccuperer les reclamation des clients
getClientReclamations(): Observable<ReclamationResponse[]> {
  return this.http.get<ReclamationResponse[]>(`${this.apiUrl}/mes-reclamations`, {
    headers: {
      'Authorization': `Bearer ${this.authService.getAccessToken()}`
    }
  });
}
//creation d'une reclamation
  createReclamation(reclamationData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/effectuer-reclamation`, reclamationData);
  }
  // gestion des notification
getClientNotifications(): Observable<NotificationReclamation[]> {
  return this.http.get<NotificationReclamation[]>(`${this.apiUrl}/notifications`, {
    headers: {
      'Authorization': `Bearer ${this.authService.getAccessToken()}`
    }
  });
}
 // marqueur des notifcation 
markNotificationAsRead(notificationId: number): Observable<any> {
  return this.http.post(`${this.apiUrl}/notifications/${notificationId}/mark-as-read`, {}, {
    headers: {
      'Authorization': `Bearer ${this.authService.getAccessToken()}`
    }
  });
}

}
