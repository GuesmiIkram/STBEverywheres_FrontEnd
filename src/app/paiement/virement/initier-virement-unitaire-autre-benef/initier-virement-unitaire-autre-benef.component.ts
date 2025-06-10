import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Compte } from 'src/app/Models/compte';
import { Beneficiaire } from 'src/app/Models/Beneficiaire';
import { VirementService } from 'src/app/services/virement.service';
import { BeneficiaireService } from 'src/app/services/beneficiaire.service';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddBeneficiaireComponent } from 'src/app/paiement/beneficiaires/add-beneficiaire/add-beneficiaire.component';
@Component({
  selector: 'app-initier-virement-unitaire-autre-benef',
  templateUrl: './initier-virement-unitaire-autre-benef.component.html',
  styleUrls: ['./initier-virement-unitaire-autre-benef.component.scss']
})
export class InitierVirementUnitaireAutreBenefComponent implements OnInit {


  comptes: Compte[] = [];
  beneficiaires: Beneficiaire[] = [];
  virementForm: FormGroup;
  soldeCompteSelectionne: number | null = null;
  private static readonly FRAIS_VIREMENT = 1.500;
  private static readonly TVAS_VIREMENT = 0.285;
  showOtpInput: boolean = false;
  virementId: number | null = null;
  otpForm: FormGroup;
private beneficiaireSelectionnePourOtp: Beneficiaire | null = null;
currentBeneficiaire: Beneficiaire | null = null;

  constructor(
    private virementService: VirementService,
    private beneficiaireService: BeneficiaireService,
    private fb: FormBuilder,
    private modalService: NgbModal
  ) {
    this.virementForm = this.fb.group({
      compteEmetteur: ['', Validators.required],
      montant: ['', [Validators.required, Validators.min(1)]],
      motif: ['', Validators.required],
      description: [''],
      idBeneficiaire: [null, Validators.required]
    });

    this.otpForm = this.fb.group({
      otpCode: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

formatTND(valeur: number): string {
  return new Intl.NumberFormat('fr-TN', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(valeur) + ' TND';
}



  ngOnInit(): void {
    this.chargerComptes();
    this.chargerBeneficiaires();

    this.virementForm.get('compteEmetteur')?.valueChanges.subscribe((selectedCompteEmetteur) => {
      const compteSelectionne = this.comptes.find(compte => compte.rib === selectedCompteEmetteur);
      this.soldeCompteSelectionne = compteSelectionne ? compteSelectionne.solde : null;
    });
  }

  chargerComptes(): void {
    this.virementService.getComptesClient().subscribe(
      (data: Compte[]) => {
        this.comptes = data;
      },
      (error: any) => {
        console.error('Erreur lors du chargement des comptes :', error);
      }
    );
  }

  chargerBeneficiaires(): void {
    this.beneficiaireService.getBeneficiairesByClientId().subscribe({
      next: (data: Beneficiaire[]) => {
        this.beneficiaires = data;
      },
      error: (error: any) => {
        console.error('Erreur chargement bénéficiaires', error);
      }
    });
  }

openAddBeneficiaireModal(): void {
    const modalRef = this.modalService.open(AddBeneficiaireComponent, {
      size: 'lg',
      centered: true
    });

    // Attendre que le modal soit rendu pour insérer le bouton de fermeture
    setTimeout(() => {
      const modalElement = document.querySelector('.modal-content');
      if (modalElement) {
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '&times;';
        closeButton.classList.add('close-modal-btn');

        // Style en ligne pour le bouton de fermeture
        closeButton.style.position = 'absolute';
        closeButton.style.top = '5px';  // Moins d'espacement par rapport au haut
        closeButton.style.right = '5px';  // Moins d'espacement à droite
        closeButton.style.border = 'none';
        closeButton.style.backgroundColor = '#dc3545';  // Fond rouge
        closeButton.style.color = 'white';             // Texte blanc
        closeButton.style.fontSize = '18px';           // Plus petit pour un bouton plus discret
        closeButton.style.cursor = 'pointer';
        closeButton.style.padding = '5px';             // Moins de padding
        closeButton.style.borderRadius = '0';          // Forme carrée
        closeButton.style.transition = 'background-color 0.3s ease, color 0.3s ease, transform 0.2s ease';
        closeButton.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';  // Ombre discrète

        // Effet au survol
        closeButton.addEventListener('mouseover', () => {
          closeButton.style.backgroundColor = '#c82333';  // Changer la couleur au survol
          closeButton.style.transform = 'scale(1.1)';     // Agrandir légèrement
        });

        closeButton.addEventListener('mouseout', () => {
          closeButton.style.backgroundColor = '#dc3545';  // Rétablir la couleur
          closeButton.style.transform = 'scale(1)';       // Rétablir la taille normale
        });

        // Fonction de fermeture
        closeButton.addEventListener('click', () => modalRef.dismiss());

        modalElement.appendChild(closeButton);
      }
    }, 100); // Petite attente pour que le modal soit chargé

    modalRef.result.then(
      (result) => {
        if (result === 'success') {
          this.chargerBeneficiaires();
          Swal.fire('Succès', 'Bénéficiaire ajouté avec succès!', 'success');
        }
      },
      (dismissed) => {
        console.log('Modal fermé sans ajout');
      }
    );
  }


  effectuerVirement(): void {
    this.markFormGroupTouched(this.virementForm);

    if (this.virementForm.invalid) {
      const invalidFields = this.getInvalidFields();
      Swal.fire({
        icon: 'error',
        title: 'Champs requis manquants',
        html: this.generateErrorMessage(invalidFields),
        confirmButtonText: 'OK'
      });
      return;
    }

    const beneficiaireSelectionne = this.beneficiaires.find(b =>
      b.id?.toString() === this.virementForm.value.idBeneficiaire.toString()
    );

  const beneficiaireSelectionneRIB = this.beneficiaires.find(b =>
      b.id?.toString() === this.virementForm.value.idBeneficiaire.toString().RIB);


    if (!beneficiaireSelectionne) {
      Swal.fire({
        icon: 'error',
        title: 'Bénéficiaire introuvable',
        text: 'Le bénéficiaire sélectionné n\'existe pas',
        confirmButtonText: 'OK'
      });
      return;
    }

    const virementData = {
      RIB_Emetteur: this.virementForm.value.compteEmetteur,
      Montant: this.virementForm.value.montant,
      Motif: this.virementForm.value.motif,
      Description: this.virementForm.value.description || '',
      TypeVirement: 'VirementUnitaireVersAutreBenef',
      IdBeneficiaire: Number(this.virementForm.value.idBeneficiaire),
      OtpCode: ''
    };

    /*const compteEmetteur = this.comptes.find(c => c.rib === virementData.RIB_Emetteur);
    if (compteEmetteur && ((compteEmetteur.solde+compteEmetteur.decouvertAutorise) < virementData.Montant)) {
      Swal.fire({
         icon: 'warning',
        title: 'Solde insuffisant',
        html: `
          <p>Votre solde actuel: ${compteEmetteur.solde} TND</p>
          <p>Montant du virement: ${virementData.Montant} TND</p>
          <p style="color: #dc3545; font-weight: bold;">Solde insuffisant pour effectuer cette opération</p>
        `,
        confirmButtonText: 'Compris'
      });
      return;
    }*/





      const compteEmetteur = this.comptes.find(c => c.rib === virementData.RIB_Emetteur);
if (compteEmetteur && ((compteEmetteur.solde + compteEmetteur.decouvertAutorise) < virementData.Montant)) {
  Swal.fire({
    title: 'Solde insuffisant',
    icon: 'warning',
    html: `
      <div style="text-align: left; margin: 10px 0;">
        <p><strong>Votre solde actuel :</strong> ${this.formatTND(compteEmetteur.solde)} TND</p>
        <p><strong>Montant du virement :</strong> ${this.formatTND(virementData.Montant)} TND</p>
        <p style="color: #dc3545; font-weight: bold; margin-top: 10px;">
          Solde insuffisant pour effectuer cette opération.
        </p>
      </div>
      <div style="font-size: 12px; color: #666; margin-top: 15px; border-top: 1px solid #eee; padding-top: 10px;">
        <p><i class="fas fa-exclamation-triangle" style="color: #dc3545; margin-right: 5px;"></i>
        Veuillez vérifier votre solde ou choisir un montant inférieur.</p>
      </div>
    `,
    confirmButtonText: 'Compris',
    confirmButtonColor: '#3366cc',
    customClass: {
      container: 'swal-bank-container',
      popup: 'swal-bank-popup',
      title: 'swal-bank-title',
      htmlContainer: 'swal-bank-html',
      confirmButton: 'swal-bank-confirm-btn'
    }
  });
  return;
}


     Swal.fire({
      title: 'Confirmez le virement unitaire',
      html: `
        <div style="text-align: left; margin: 10px 0;">
          <p><strong>Compte Émetteur :</strong> ${virementData.RIB_Emetteur}</p>
          <p><strong>Bénéficiaire:</strong> ${beneficiaireSelectionne.nom} ${beneficiaireSelectionne.prenom} ${beneficiaireSelectionne.ribCompte}</p>
          <p><strong>Montant:</strong> ${this.formatTND(virementData.Montant)} </p>
          <p><strong>Frais:</strong>${this.formatTND(InitierVirementUnitaireAutreBenefComponent.FRAIS_VIREMENT)}</p>
          <p><strong>Total à débiter:</strong>  ${this.formatTND(virementData.Montant + InitierVirementUnitaireAutreBenefComponent.FRAIS_VIREMENT + InitierVirementUnitaireAutreBenefComponent.TVAS_VIREMENT)} </p>
          <p><strong>Motif:</strong> ${virementData.Motif}</p>
          ${virementData.Description ? `<p><strong>Description:</strong> ${virementData.Description}</p>` : ''}
        </div>
        <div style="font-size: 12px; color: #666; margin-top: 15px; border-top: 1px solid #eee; padding-top: 10px;">
      <p><i class="fas fa-shield-alt" style="color: #3366cc; margin-right: 5px;"></i> Un code OTP vous sera envoyé par SMS pour valider cette opération.</p>

           <p><i class="fas fa-exchange-alt" style="color: #3366cc; margin-right: 5px;"></i> En confirmant, vous autorisez le débit immédiat de votre compte.</p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3366cc',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Confirmer le virement',
      cancelButtonText: 'Annuler',
      focusCancel: true,
      customClass: {
        container: 'swal-bank-container',
        popup: 'swal-bank-popup',
        title: 'swal-bank-title',
        htmlContainer: 'swal-bank-html',
        confirmButton: 'swal-bank-confirm-btn',
        cancelButton: 'swal-bank-cancel-btn'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.envoyerDemandeVirement(virementData, beneficiaireSelectionne);
      }
    });
  }

   envoyerDemandeVirement(virementData: any, beneficiaireSelectionne: Beneficiaire): void {
    this.virementService.effectuerVirement(virementData).subscribe({
      next: (response: any) => {
        if (response.message.includes("OTP envoyé")) {
          this.virementId = response.virementId;
          this.demanderOtp(beneficiaireSelectionne);
                  Swal.fire('Code envoyé', response.message || 'Un code OTP a été envoyé à votre mobile', 'success');

        }
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Échec du virement',
          html: `<p>${error.error?.message || 'Une erreur est survenue lors du virement.'}</p>`,
          confirmButtonText: 'Compris'
        });
      }
    });
  }


 demanderOtp(beneficiaire: Beneficiaire): void {
  this.currentBeneficiaire = beneficiaire;
  this.showOtpInput = true;
}




// Modifiez la signature de la méthode


validerVirementAvecOtp(otpCode: string): void {
    const payload = {
        riB_Emetteur: this.virementForm.value.compteEmetteur,
        montant: this.virementForm.value.montant,
        motif: this.virementForm.value.motif,
        description: this.virementForm.value.description || '',
        typeVirement: 'VirementUnitaireVersAutreBenef',
        idBeneficiaire: Number(this.virementForm.value.idBeneficiaire),
        otpCode: otpCode,
        id: this.virementId
    };

    console.log('Envoi du payload:', payload); // Debug

    this.virementService.effectuerVirement(payload).subscribe({
        next: (response) => {
            Swal.fire({


                title: 'Virement effectué',
              html: `
                <div style="text-align: center;">
                  <i class="fas fa-check-circle" style="color: #28a745; font-size: 48px; margin-bottom: 15px;"></i>
                  <p>Votre virement a été effectué avec succès.</p>
                   <p><strong>Bénéficiaire:</strong> ${this.currentBeneficiaire?.nom}  ${this.currentBeneficiaire?.prenom} ${this.currentBeneficiaire?.ribCompte}</p>
                  <p><strong>Motif:</strong> ${this.virementForm.value.motif}</p>
                  <p><strong>Montant:</strong> ${this.virementForm.value.montant} TND</p>

                </div>
                <div style="font-size: 13px; color: #666; margin-top: 20px; border-top: 1px solid #eee; padding-top: 10px;">
                  <p><i class="fas fa-mobile-alt" style="color: #3366cc; margin-right: 5px;"></i> Une notification SMS a été envoyée.</p>
                  <p><i class="fas fa-exchange-alt" style="color: #3366cc; margin-right: 5px;"></i> Les fonds ont été transférés immédiatement.</p>
                </div>
              `,
              confirmButtonText: 'Fermer',
              confirmButtonColor: '#3366cc',
              customClass: {
                popup: 'swal-bank-popup-success'
            }
            });
            this.virementForm.reset();
            this.showOtpInput = false;
            this.virementId = null;
            this.currentBeneficiaire = null;
        },
        error: (error) => {
            console.error('Erreur détaillée:', error); // Debug
            let errorMessage = error.error?.message || 'Le code OTP est invalide ou a expiré.';
            if (error.error?.errors) {
                errorMessage += `<br><pre>${JSON.stringify(error.error.errors, null, 2)}</pre>`;
            }
            Swal.fire({
                icon: 'error',
                title: 'Échec de la validation',
                html: errorMessage,
                confirmButtonText: 'Réessayer'
            });
        }
    });
}
  // Méthodes helper
   markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

 getInvalidFields(): string[] {
    return Object.keys(this.virementForm.controls)
      .filter(key => {
        const control = this.virementForm.get(key);
        return control?.invalid && key !== 'description';
      })
      .map(key => {
        switch(key) {
          case 'compteEmetteur': return 'Compte émetteur';
          case 'montant': return 'Montant';
          case 'motif': return 'Motif';
          case 'idBeneficiaire': return 'Bénéficiaire';
          default: return key;
        }
      });
  }

   generateErrorMessage(fields: string[]): string {
    return `
      <div class="error-list">
        <p>Veuillez remplir correctement les champs suivants :</p>
        <ul>
          ${fields.map(field => `<li>${field}</li>`).join('')}
        </ul>
      </div>
    `;
  }

getFormValidationErrors(): any[] {
    return Object.keys(this.virementForm.controls)
      .filter(key => this.virementForm.get(key)?.errors)
      .map(key => ({
        field: key,
        errors: this.virementForm.get(key)?.errors
      }));
  }
}












