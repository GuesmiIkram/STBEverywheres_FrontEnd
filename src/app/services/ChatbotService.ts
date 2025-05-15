// chatbot.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environnement } from '../environnement/environnement';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  
  private apiUrl = environnement.apiurl;
  constructor(private http: HttpClient) { }

  sendMessage(message: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/chat`, { Message: message });
  }
}