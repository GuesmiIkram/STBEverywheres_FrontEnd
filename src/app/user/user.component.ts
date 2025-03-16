import { Component, OnInit } from '@angular/core';
import { ClientService } from '../services/client.service';
import { Client } from '../Models/Client';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
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
  validateField(field: string): void {
    switch (field) {
      case 'currentPassword':
        this.currentPasswordError = !this.changePasswordData.currentPassword;
        break;
      case 'newPassword':
        this.newPasswordError = !this.changePasswordData.newPassword;
        break;
      case 'confirmNewPassword':
        this.confirmNewPasswordError = !this.changePasswordData.confirmNewPassword;
        break;
    }
  }
  checkPasswords(): void {
    this.passwordMismatch =
      this.changePasswordData.newPassword !== this.changePasswordData.confirmNewPassword;
  }

  // Méthode pour vérifier si le formulaire est invalide
  isFormInvalid(): boolean {
    return (
      !this.changePasswordData.currentPassword ||
      !this.changePasswordData.newPassword ||
      !this.changePasswordData.confirmNewPassword ||
      this.passwordMismatch
    );
  }
  // Méthode pour télécharger la fiche KYC
  downloadKYC(): void {
    this.clientService.downloadKYC().subscribe(
      (blob: Blob) => {
        // Créer un lien pour télécharger le fichier
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;

        // Nom du fichier (vous pouvez personnaliser cela)
        if (this.client) {
          a.download = `Fiche_KYC_${this.client.nom}_${this.client.prenom}.pdf`;
        } else {
          a.download = 'Fiche_KYC.pdf';
        }

        // Déclencher le téléchargement
        a.click();

        // Libérer l'URL de l'objet Blob
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Erreur lors du téléchargement de la fiche KYC', error);
      }
    );
  }

  onSubmit(): void {
    if (this.client) {
      this.clientService.updateClientInfo(this.client).subscribe({
        next: (updatedClient: Client) => {
          console.log('Informations mises à jour avec succès', updatedClient);

          // Afficher une alerte de succès avec SweetAlert2
          Swal.fire({
            icon: 'success',
            title: 'Succès',
            text: 'Informations mises à jour avec succès.',
            timer: 2000, // Fermer automatiquement après 2 secondes
            showConfirmButton: false
          });
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour des informations', error);

          // Extraire le message d'erreur en fonction de la structure de l'erreur
          let errorMessage = 'Erreur lors de la mise à jour des informations';
          if (error.error && error.error.message) {
            errorMessage = error.error.message; // Si l'erreur contient un message
          } else if (error.message) {
            errorMessage = error.message; // Si l'erreur est une chaîne de caractères
          } else if (error.error && typeof error.error === 'string') {
            errorMessage = error.error; // Si l'erreur est une chaîne de caractères dans error.error
          }

          // Afficher une alerte d'erreur avec SweetAlert2
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: errorMessage,
          });
        }
      });
    }
  }
   // Méthode pour gérer la sélection d'un fichier
   onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] as File;
    if (this.selectedFile) {
      this.uploadProfileImage();
    }
  }

  // Méthode pour télécharger la nouvelle photo
  uploadProfileImage(): void {
    if (this.selectedFile && this.client) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);

      this.clientService.uploadProfileImage(this.client.id, formData).subscribe({
        next: (response: any) => {
          console.log('Photo de profil mise à jour avec succès', response);
          this.client!.photoClient = response.fileName; // Mettre à jour le nom de la photo dans le client
          Swal.fire({
            icon: 'success',
            title: 'Succès',
            text: 'Photo de profil mise à jour avec succès.',
            timer: 2000,
            showConfirmButton: false
          });
        },
        error: (error) => {
          console.error('Erreur lors du téléchargement de la photo de profil', error);
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Erreur lors du téléchargement de la photo de profil.',
          });
        }
      });
    }
  }

  // Méthode pour supprimer la photo de profil
  removeProfileImage(): void {
    if (this.client) {
      this.clientService.removeProfileImage(this.client.id).subscribe({
        next: () => {
          console.log('Photo de profil supprimée avec succès');
          this.client!.photoClient = ''; // Supprimer le nom de la photo dans le client
          Swal.fire({
            icon: 'success',
            title: 'Succès',
            text: 'Photo de profil supprimée avec succès.',
            timer: 2000,
            showConfirmButton: false
          });
        },
        error: (error) => {
          console.error('Erreur lors de la suppression de la photo de profil', error);
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Erreur lors de la suppression de la photo de profil.',
          });
        }
      });
    }
  }

  onChangePassword() {
    // Vérifier que les nouveaux mots de passe correspondent
    if (this.changePasswordData.newPassword !== this.changePasswordData.confirmNewPassword) {
      alert('Les nouveaux mots de passe ne correspondent pas.');
      return;
    }

    // Appeler la méthode changePassword du service AuthService
    this.authService.changePassword(
      this.changePasswordData.currentPassword,
      this.changePasswordData.newPassword,
      this.changePasswordData.confirmNewPassword
    ).subscribe({
      next: (response) => {
        alert('Mot de passe changé avec succès !');
      },
      error: (err) => {
        console.error('Erreur lors du changement de mot de passe', err);
        alert('Une erreur s\'est produite lors du changement de mot de passe.');
      }
    });}
}