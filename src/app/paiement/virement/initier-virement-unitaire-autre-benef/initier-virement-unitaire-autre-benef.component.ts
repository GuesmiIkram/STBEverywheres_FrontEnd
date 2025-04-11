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
  private static readonly FRAIS_VIREMENT = 0.5;


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
        console.log('Données reçues:', JSON.stringify(data, null, 2));
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
    // Marquer tous les champs comme touchés pour afficher les erreurs
    this.markFormGroupTouched(this.virementForm);

    // Debug: Afficher l'état de validation dans la console
    console.log('État du formulaire:', {
      valid: this.virementForm.valid,
      errors: this.getFormValidationErrors(),
      values: this.virementForm.value
    });

    if (this.virementForm.invalid) {
      const invalidFields = this.getInvalidFields();

      Swal.fire({
        icon: 'error',
        title: 'Champs requis manquants',
        html: this.generateErrorMessage(invalidFields),
        confirmButtonText: 'OK',
        confirmButtonColor: '#3366cc',
        customClass: {
          container: 'swal-container',
          popup: 'swal-popup',
          title: 'swal-title',
          htmlContainer: 'swal-html',
          confirmButton: 'swal-confirm-btn'
        }
      });
      return;
    }

    const beneficiaireSelectionne = this.beneficiaires.find(b =>
      b.id?.toString() === this.virementForm.value.idBeneficiaire.toString()
    );

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
      Description: this.virementForm.value.description || '', // Garantir une string vide si null/undefined
      TypeVirement: 'VirementUnitaireVersAutreBenef',
      IdBeneficiaire: Number(this.virementForm.value.idBeneficiaire) // Conversion explicite
    };

    // Vérification du solde
    const compteEmetteur = this.comptes.find(c => c.rib === virementData.RIB_Emetteur);
    if (compteEmetteur && (compteEmetteur.solde < virementData.Montant)) {
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
    }

    // Confirmation
    Swal.fire({
      title: 'Confirmez le virement unitaire',
      html: `
        <div style="text-align: left; margin: 10px 0;">
          <p><strong>Compte Émetteur :</strong> ${virementData.RIB_Emetteur}</p>
          <p><strong>Bénéficiaire:</strong> ${beneficiaireSelectionne.nom} ${beneficiaireSelectionne.prenom} ${beneficiaireSelectionne.ribCompte}</p>
          <p><strong>Montant:</strong> ${virementData.Montant} TND</p>
          <p><strong>Frais:</strong>${InitierVirementUnitaireAutreBenefComponent.FRAIS_VIREMENT.toFixed(2)} TND</p>
          <p><strong>Total à débiter:</strong> ${virementData.Montant + InitierVirementUnitaireAutreBenefComponent.FRAIS_VIREMENT} TND</p>
          <p><strong>Motif:</strong> ${virementData.Motif}</p>
          ${virementData.Description ? `<p><strong>Description:</strong> ${virementData.Description}</p>` : ''}
        </div>
        <div style="font-size: 12px; color: #666; margin-top: 15px; border-top: 1px solid #eee; padding-top: 10px;">
          <p>En confirmant, vous autorisez le débit immédiat de votre compte.</p>
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
        this.virementService.effectuerVirement(virementData).subscribe({
          next: (response) => {
            Swal.fire({
              title: 'Virement effectué',
              html: `
                <div style="text-align: center;">
                  <i class="fas fa-check-circle" style="color: #28a745; font-size: 48px; margin-bottom: 15px;"></i>
                  <p>Votre virement a été effectué avec succès.</p>
                   <p><strong>Bénéficiaire:</strong> ${beneficiaireSelectionne.nom}  ${beneficiaireSelectionne.prenom} ${beneficiaireSelectionne.ribCompte}</p>
                  <p><strong>Motif:</strong> ${virementData.Motif}</p>
                  <p><strong>Montant:</strong> ${virementData.Montant} TND</p>

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
          },
          error: (error) => {
            console.error('Erreur virement:', error);
            Swal.fire({
              icon: 'error',
              title: 'Échec du virement',
              html: `
                <p>${error.error?.message || 'Une erreur est survenue lors du virement.'}</p>
                ${error.error?.details ? `<p class="error-detail">${error.error.details}</p>` : ''}
              `,
              confirmButtonText: 'Compris'
            });
          }
        });
      }
    });
  }

  // Méthodes helper
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  private getInvalidFields(): string[] {
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

  private generateErrorMessage(fields: string[]): string {
    if (fields.length === 0) return 'Veuillez vérifier les informations saisies';

    return `
      <div class="error-list">
        <p>Veuillez remplir correctement les champs suivants :</p>
        <ul>
          ${fields.map(field => `<li>${field}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  private getFormValidationErrors() {
    return Object.keys(this.virementForm.controls)
      .filter(key => this.virementForm.get(key)?.errors)
      .map(key => ({
        field: key,
        errors: this.virementForm.get(key)?.errors
      }));
  }}
