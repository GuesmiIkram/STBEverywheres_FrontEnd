import { Component, OnInit } from '@angular/core';
import { Client } from 'src/app/Models/Client';
import { NotificationPack } from 'src/app/Models/NotificationPack';
import { AuthService } from 'src/app/services/auth.service';
import { ClientService } from 'src/app/services/client.service';
import { ReclamationService } from 'src/app/services/ReclamationService';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  
  isAgent: boolean = false;
  isClient: boolean = false;
  userRole: string = '';
  client: Client = {
    id: 0,
    nom: '',
    prenom: '',
    dateNaissance: new Date(),
    telephone: '',
    email: '',
    adresse: '',
    civilite: '',
    nationalite: '',
    etatCivil: '',
    residence: '',
    numCIN: '',
    dateDelivranceCIN: new Date(),
    dateExpirationCIN: new Date(),
    lieuDelivranceCIN: '',
    photoClient: '',
    genre: '',
    profession: '',
    situationProfessionnelle: '',
    niveauEducation: '',
    nombreEnfants: 0,
    revenuMensuel: 0,
    paysNaissance: '',
    nomMere: '',
    nomPere: '',
  };
  
  selectedFile: File | null = null;
  changePasswordData = {
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  };
  currentPasswordError = false;
  newPasswordError = false;
  confirmNewPasswordError = false;
  passwordMismatch = false;

  constructor(
    private clientService: ClientService,
    private reclamationService: ReclamationService,
    private authService: AuthService
  ) {}

  clientNotifications: NotificationPack[] = [];
  reclamationNotifications: NotificationPack[] = [];
  totalUnreadCount = 0;

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole();
    this.isAgent = this.authService.isAgent();
    this.isClient = this.authService.isClient();
    if (this.isClient) {
      this.getClientInfo();
      this.loadNotifications();
      this.loadNotificationsReclamtion();
    }
  }

  getClientInfo(): void {
    this.clientService.getClientInfo().subscribe(
      (data: Client) => {
        this.client = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des informations du client', error);
      }
    );
  }

  loadNotifications(): void {
    this.clientService.getClientNotifications().subscribe(
      (notifications: NotificationPack[]) => {
        this.clientNotifications = notifications;
        this.calculateTotalUnread();
      },
      (error) => {
        console.error('Erreur lors du chargement des notifications client', error);
      }
    );
  }

  loadNotificationsReclamtion(): void {
    this.reclamationService.getClientNotifications().subscribe(
      (notifications: NotificationPack[]) => {
        this.reclamationNotifications = notifications;
        this.calculateTotalUnread();
      },
      (error) => {
        console.error('Erreur lors du chargement des notifications réclamation', error);
      }
    );
  }

  calculateTotalUnread(): void {
    const clientUnread = this.clientNotifications.filter(n => !n.isRead).length;
    const reclamationUnread = this.reclamationNotifications.filter(n => !n.isRead).length;
    this.totalUnreadCount = clientUnread + reclamationUnread;
  }

  markAsRead(notificationId: number): void {
    this.clientService.markNotificationAsRead(notificationId).subscribe(
      () => {
        const notification = this.clientNotifications.find(n => n.id === notificationId);
        if (notification) {
          notification.isRead = true;
          this.calculateTotalUnread();
        }
      },
      (error) => {
        console.error('Erreur lors du marquage de la notification comme lue', error);
      }
    );
  }

  markAsReadrec(notificationId: number): void {
    this.reclamationService.markNotificationAsRead(notificationId).subscribe(
      () => {
        const notification = this.reclamationNotifications.find(n => n.id === notificationId);
        if (notification) {
          notification.isRead = true;
          this.calculateTotalUnread();
        }
      },
      (error) => {
        console.error('Erreur lors du marquage de la notification comme lue', error);
      }
    );
  }

  ShowHideMenu(): void {
    document.getElementsByTagName("body")[0].classList.toggle('toggle-sidebar');
  }
}