import { Component, OnInit, ViewChild } from '@angular/core';
import { ClientService } from '../services/client.service';
import { Client } from '../Models/Client';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';
import { NgForm, NgModel } from '@angular/forms';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  @ViewChild('userForm') userForm!: NgForm;
  @ViewChild('phone') phone!: NgModel;
  @ViewChild('email') email!: NgModel;
  @ViewChild('nombreEnfants') nombreEnfants!: NgModel;
  @ViewChild('revenuMensuel') revenuMensuel!: NgModel;

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
  positiveNumberPattern = "^[0-9]*\.?[0-9]+$";

  constructor(
    private clientService: ClientService,
    private authService: AuthService
  ) {}

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

  isFormInvalid(): boolean {
    return (
      !this.changePasswordData.currentPassword ||
      !this.changePasswordData.newPassword ||
      !this.changePasswordData.confirmNewPassword ||
      this.passwordMismatch
    );
  }
  
  downloadKYC(): void {
    this.clientService.downloadKYC().subscribe(
      (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;

        if (this.client) {
          a.download = `Fiche_KYC_${this.client.nom}_${this.client.prenom}.pdf`;
        } else {
          a.download = 'Fiche_KYC.pdf';
        }

        a.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Erreur lors du téléchargement de la fiche KYC', error);
      }
    );
  }

  onSubmit(): void {
    // Marquer tous les champs comme touchés pour afficher les erreurs
    this.markAllAsTouched();

    // Vérifier la validité des champs requis
    if (this.phone?.invalid || this.email?.invalid || 
        this.nombreEnfants?.invalid || this.revenuMensuel?.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Formulaire invalide',
        text: 'Veuillez corriger les erreurs avant de soumettre.',
      });
      return;
    }

    if (this.client) {
      this.clientService.updateClientInfo(this.client).subscribe({
        next: (updatedClient: Client) => {
          Swal.fire({
            icon: 'success',
            title: 'Succès',
            text: 'Informations mises à jour avec succès.',
            timer: 2000,
            showConfirmButton: false
          });
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour des informations', error);
          let errorMessage = 'Erreur lors de la mise à jour des informations';
          if (error.error?.message) errorMessage = error.error.message;
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: errorMessage,
          });
        }
      });
    }
  }

  markAllAsTouched(): void {
    if (this.phone?.control) this.phone.control.markAsTouched();
    if (this.email?.control) this.email.control.markAsTouched();
    if (this.nombreEnfants?.control) this.nombreEnfants.control.markAsTouched();
    if (this.revenuMensuel?.control) this.revenuMensuel.control.markAsTouched();
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] as File;
    if (this.selectedFile) {
      this.uploadProfileImage();
    }
  }

 /**
 * Upload le fichier sélectionné comme photo de profil
 * Effectue des validations et gère l'affichage des notifications
 */
 uploadProfileImage(): void {
  if (!this.selectedFile || !this.client) return;

  this.clientService.uploadProfileImage(this.selectedFile).subscribe({
    next: (response) => {
      this.client.photoClient = response.fileName;
      Swal.fire('Succès', 'Image uploadée avec succès', 'success');
    },
    error: (error) => {
      console.error('Erreur détaillée:', error);
      let errorMsg = 'Échec de l\'upload';
      
      if (error.error?.errors) {
        errorMsg = Object.values(error.error.errors).join('\n');
      } else if (error.error?.title) {
        errorMsg = error.error.title;
      }

      Swal.fire('Erreur', errorMsg, 'error');
    }
  });
}
  removeProfileImage(): void {
    if (this.client) {
      this.clientService.removeProfileImage(this.client.id).subscribe({
        next: () => {
          this.client!.photoClient = '';
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
  async onChangePassword() {
    // Validation initiale
    if (this.changePasswordData.newPassword !== this.changePasswordData.confirmNewPassword) {
        Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Les mots de passe ne correspondent pas',
            customClass: {
                popup: 'lstb-popup',
                title: 'lstb-title',
                confirmButton: 'lstb-confirm-button'
            },
            confirmButtonColor: '#ef4444'
        });
        return;
    }

    try {
        // 1. Demander l'envoi du code OTP
        await this.clientService.requestPasswordChangeOTP().toPromise();

        // 2. Afficher la popup de vérification OTP avec le nouveau style
        const { value: otpCode } = await Swal.fire({
            title: 'Vérification de sécurité',
            html: `
                <div class="otp-verification-swal">
                    <p style="color: #64748b; font-size: 14px; text-align: center; margin-bottom: 20px; font-weight: 400; line-height: 1.5;">
                        Un code de vérification à 6 chiffres a été envoyé à votre adresse email
                    </p>
                    <input 
                        type="text" 
                        id="swal-otp" 
                        class="swal2-input" 
                        placeholder="Code OTP"
                        maxlength="6"
                        style="height: 40px; border: 1px solid #e2e8f0; border-radius: 6px; padding: 0 12px; font-size: 14px; width: 100%; margin: 0; box-shadow: none; letter-spacing: 5px; text-align: center;"
                    >
                    <div 
                        id="swal-error" 
                        class="text-danger" 
                        style="color: #ef4444; font-size: 12px; text-align: left; font-weight: 500; min-height: 20px; margin-top: 5px; margin-bottom: 10px;"
                    ></div>
                </div>
            `,
            width: '400px',
            showConfirmButton: true,
            confirmButtonText: 'Valider',
            showCancelButton: true,
            cancelButtonText: 'Annuler',
            showCloseButton: true,
            focusConfirm: false,
            customClass: {
                popup: 'lstb-popup',
                title: 'lstb-title',
                confirmButton: 'lstb-confirm-button',
                closeButton: 'lstb-close-button',
                cancelButton: 'lstb-cancel-button'
            },
            confirmButtonColor: '#1e3a8a',
            cancelButtonColor: '#64748b',
            buttonsStyling: true,
            preConfirm: () => {
                const otpInput = Swal.getPopup()?.querySelector('#swal-otp') as HTMLInputElement;
                const errorEl = Swal.getPopup()?.querySelector('#swal-error');
                
                if (!otpInput?.value) {
                    if (errorEl) errorEl.innerHTML = 'Le code OTP est requis';
                    return false;
                }
                
                if (!/^\d{6}$/.test(otpInput.value)) {
                    if (errorEl) errorEl.innerHTML = 'Le code doit contenir 6 chiffres';
                    return false;
                }
                
                return otpInput.value;
            },
            allowOutsideClick: () => !Swal.isLoading(),
            didOpen: () => {
                const style = document.createElement('style');
                style.textContent = `
                    .lstb-popup {
                        border-radius: 12px;
                        font-family: 'Roboto', 'Segoe UI', sans-serif;
                    }
                    .lstb-title {
                        color: #1e293b;
                        font-size: 20px;
                        font-weight: 600;
                        margin-bottom: 5px;
                    }
                    .lstb-confirm-button {
                        background: linear-gradient(90deg, #1e3a8a 0%, #0f766e 100%) !important;
                        border-radius: 6px !important;
                        font-weight: 500 !important;
                        padding: 10px 24px !important;
                        box-shadow: none !important;
                        margin-right: 8px !important;
                    }
                    .lstb-confirm-button:hover {
                        opacity: 0.9 !important;
                    }
                    .lstb-cancel-button {
                        background: #fff !important;
                        border: 1px solid #e2e8f0 !important;
                        color: #64748b !important;
                        border-radius: 6px !important;
                        font-weight: 500 !important;
                        padding: 10px 24px !important;
                        box-shadow: none !important;
                    }
                    .lstb-cancel-button:hover {
                        background: #f8fafc !important;
                    }
                    .lstb-close-button {
                        color: #64748b !important;
                    }
                    .lstb-close-button:hover {
                        color: #1e293b !important;
                    }
                    .swal2-input:focus {
                        border-color: #0f766e !important;
                        box-shadow: none !important;
                    }
                `;
                document.head.appendChild(style);
                
                // Focus automatique sur le champ OTP
                setTimeout(() => {
                    const input = Swal.getPopup()?.querySelector('#swal-otp') as HTMLInputElement;
                    input?.focus();
                }, 100);
            }
        });

        if (!otpCode) return;

        // 3. Envoyer la demande de changement
        const result = await this.clientService.changePasswordWithOTP({
            currentPassword: this.changePasswordData.currentPassword,
            newPassword: this.changePasswordData.newPassword,
            confirmNewPassword: this.changePasswordData.confirmNewPassword,
            otpCode: otpCode
        }).toPromise();

        // Message de succès stylisé
        Swal.fire({
            icon: 'success',
            title: 'Succès',
            text: 'Votre mot de passe a été changé avec succès',
            customClass: {
                popup: 'lstb-popup',
                title: 'lstb-title',
                confirmButton: 'lstb-confirm-button'
            },
            confirmButtonColor: '#1e3a8a',
            didOpen: () => {
                // Réappliquer les styles si nécessaire
            }
        });

        this.resetForm();

    } catch (error: any) {
        console.error('Erreur:', error);
        let errorMessage = 'Une erreur est survenue';
        
        if (error.status === 400) {
            errorMessage = error.error?.message || 'Requête invalide';
        } else if (error.status === 401) {
            errorMessage = 'Non autorisé - veuillez vous reconnecter';
        } else if (error.status === 404) {
            errorMessage = 'Service indisponible - contactez le support';
        }

        Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: errorMessage,
            customClass: {
                popup: 'lstb-popup',
                title: 'lstb-title',
                confirmButton: 'lstb-confirm-button'
            },
            confirmButtonColor: '#ef4444'
        });
    }
}
  
  private resetForm(): void {
    this.changePasswordData = {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    };
  }
}