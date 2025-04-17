import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Client } from '../Models/Client';
import { AuthService } from './auth.service';
import { NotificationPack } from '../Models/NotificationPack';
import { environnement } from '../environnement/environnement';


@Injectable({
  providedIn: 'root',
})
export class ClientService {
  

   private apiUrl = environnement.apiurl+ "/client";
  constructor(private http: HttpClient,private authService :AuthService) {}

  // Récupérer les infos du client
  getClientInfo(): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/me`);
  }
// Modifiez votre service pour ajouter des headers spécifiques
uploadStudentDocuments(files: FormData): Observable<any> {
  // Création des headers avec HttpHeaders
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${this.authService.getAccessToken()}`,
    'Accept': 'application/json'
    // Ne pas ajouter 'Content-Type' - sera défini automatiquement par le navigateur
  });



  return this.http.post(`${this.apiUrl}/upload-documents`, files, {
    headers: headers,
    reportProgress: true,  // Active le suivi de progression
    observe: 'events'     // Permet de recevoir tous les événements HTTP
  }).pipe(
    catchError(error => {
      console.error('Erreur lors de l\'upload:', {
        status: error.status,
        message: error.message,
        url: error.url,
        headers: error.headers
      });
      return throwError(() => error);
    })
  );
}
getClientNotifications(): Observable<NotificationPack[]> {
  return this.http.get<NotificationPack[]>(`${this.apiUrl}/notifications`, {
    headers: {
      'Authorization': `Bearer ${this.authService.getAccessToken()}`
    }
  });
}

markNotificationAsRead(notificationId: number): Observable<any> {
  return this.http.post(`${this.apiUrl}/notifications/${notificationId}/mark-as-read`, {}, {
    headers: {
      'Authorization': `Bearer ${this.authService.getAccessToken()}`
    }
  });
}

getClientInfoById(clientId: number): Observable<Client> {
  return this.http.get<Client>(`${this.apiUrl}/${clientId}`);
}
uploadElyssaDocuments(files: FormData): Observable<any> {
  // Création des headers avec HttpHeaders
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${this.authService.getAccessToken()}`,
    'Accept': 'application/json'
    // Ne pas ajouter 'Content-Type' - sera défini automatiquement par le navigateur
  });

  return this.http.post(`${this.apiUrl}/upload-documents-elyssa`, files, {
    headers: headers,
    reportProgress: true,  // Active le suivi de progression
    observe: 'events'     // Permet de recevoir tous les événements HTTP
  }).pipe(
    catchError(error => {
      console.error('Erreur lors de l\'upload:', {
        status: error.status,
        message: error.message,
        url: error.url,
        headers: error.headers
      });
      return throwError(() => error);
    })
  );
}

  // Mettre à jour les infos du client
  updateClientInfo(client: Client): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}/update`, client);
  }
  downloadKYC(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/kyc/download`, { responseType: 'blob' });
  }

  register(registerData: { rib: string, email: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, registerData).pipe(
      tap(() => {
        console.log('Inscription réussie.');
      }),
      catchError((error) => {
        console.error('Erreur lors de l\'inscription :', error);

        // Extraire le message d'erreur du backend
        const errorMessage = error.error?.message || 'Erreur lors de l\'inscription';

        // Renvoyer l'erreur avec le message du backend
        return throwError(() => ({ message: errorMessage }));
      })
    );
  }
 // Dans votre service
 uploadProfileImage(file: File): Observable<{fileName: string}> {
  const formData = new FormData();
  formData.append('file', file, file.name);

  return this.http.post<{fileName: string}>(
    `${this.apiUrl}/upload-profile-image`,
    formData,
    {
      headers: {
        'Authorization': `Bearer ${this.authService.getAccessToken()}`
      }
    }
  );
}


  // Supprimer la photo de profil
  removeProfileImage(clientId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/remove-profile-image`);
  }
 
  // Méthode pour demander l'envoi du code OTP
  requestPasswordChangeOTP(): Observable<any> {
    return this.http.post(`${this.apiUrl}/request-password-change-otp`, {}).pipe(
      catchError(error => throwError(() => error))
    );
  }

  changePasswordWithOTP(data: {
    currentPassword: string,
    newPassword: string,
    confirmNewPassword: string,
    otpCode: string
  }): Observable<any> {
    const payload = {
      CurrentPassword: data.currentPassword,
      NewPassword: data.newPassword,
      ConfirmNewPassword: data.confirmNewPassword,
      OTPCode: data.otpCode
    };

    return this.http.post(`${this.apiUrl}/change-password-with-otp`, payload).pipe(
      catchError(error => throwError(() => error))
    );
  }
}

