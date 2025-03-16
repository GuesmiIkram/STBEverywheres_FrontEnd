import { Component, OnInit } from '@angular/core';
import { Client } from 'src/app/Models/Client';
import { AuthService } from 'src/app/services/auth.service';
import { ClientService } from 'src/app/services/client.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

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
  }; // Initialisez `client` avec une valeur p
  //client: Client | null = null;
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
  constructor(private clientService: ClientService,private authService:AuthService) {}

  ngOnInit(): void {
    this.getClientInfo();
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


  ShowHideMenu(){
    document.getElementsByTagName("body")[0].classList.toggle('toggle-sidebar');
  }

}
