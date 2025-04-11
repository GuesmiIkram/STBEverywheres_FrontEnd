
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Compte } from 'src/app/Models/compte';
import { VirementService } from 'src/app/services/virement.service';
import { Beneficiaire } from 'src/app/Models/Beneficiaire';
import { BeneficiaireService } from 'src/app/services/beneficiaire.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddBeneficiaireComponent } from 'src/app/paiement/beneficiaires/add-beneficiaire/add-beneficiaire.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-initier-virement-masse',
  templateUrl: './initier-virement-masse.component.html',
  styleUrls: ['./initier-virement-masse.component.scss']
})
export class InitierVirementMasseComponent implements OnInit {
  virementForm: FormGroup;
  fichier: File | null = null;
  methodeVirement: string = 'form'; // Valeur par défaut : formulaire
  soldeCompteSelectionne: number | null = null;
  beneficiaires: Beneficiaire[] = []; // Liste des bénéficiaires récupérés
  comptes: Compte[] = []; // Stocke les comptes récupérés

  constructor(private fb: FormBuilder, private virementService: VirementService, private beneficiaireService: BeneficiaireService,private modalService: NgbModal
  ) {
    this.virementForm = this.fb.group({
      fichier: [null],
      ribEmetteur: ['', Validators.required],
      motif: ['', Validators.required],
      description: ['', Validators.required],
      beneficiaires: this.fb.array([
        this.fb.group({
          idBeneficiaire: ['', Validators.required],
          montant: ['', [Validators.required, Validators.min(1)]]
        })
      ])
    });
  }

  ngOnInit(): void {
    console.log('Component InitierVirementMasse initialisé');
    this.chargerComptes();
    this.chargerBeneficiaires();

    // Écoute des changements dans le champ 'ribEmetteur'
    this.virementForm.get('ribEmetteur')?.valueChanges.subscribe((ribEmetteur: string) => {
      const compteSelectionne = this.comptes.find(compte => compte.rib === ribEmetteur);
      this.soldeCompteSelectionne = compteSelectionne ? compteSelectionne.solde : null;
    });
  }

  get beneficiairesFormArray(): FormArray {
    return this.virementForm.get('beneficiaires') as FormArray;
  }

  chargerComptes(): void {
    this.virementService.getComptesClient().subscribe(
      (data: Compte[]) => {
        this.comptes = data;
        console.log('Comptes récupérés:', this.comptes);
      },
      (error: any) => {
        console.error('Erreur lors du chargement des comptes :', error);
      }
    );
  }

  chargerBeneficiaires(): void {
    this.beneficiaireService.getBeneficiairesByClientId().subscribe({
      next: (data: Beneficiaire[]) => {
        console.log('Données bénéficiaires reçues:', data);
        this.beneficiaires = data;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des bénéficiaires:', error);
      }
    });
  }

  // Créer un nouvel objet bénéficiaire
  nouveauBeneficiaire(): FormGroup {
    return this.fb.group({
      idBeneficiaire: ['', Validators.required],
      montant: ['', [Validators.required, Validators.min(1)]]
    });
  }

  // Ajouter un bénéficiaire dynamiquement
  ajouterBeneficiaire(): void {
    this.beneficiairesFormArray.push(this.nouveauBeneficiaire());
  }

  // Supprimer un bénéficiaire dynamiquement
  supprimerBeneficiaire(index: number): void {
    if (this.beneficiairesFormArray.length > 1) {
      this.beneficiairesFormArray.removeAt(index);
    }
  }

  onMethodChange(methode: string): void {
    console.log('Méthode de virement sélectionnée:', methode);
    this.methodeVirement = methode;
  }

  onFileChange(event: any): void {
    if (!event.target.files || event.target.files.length === 0) {
      console.warn('Aucun fichier sélectionné');
      return;
    }

    this.fichier = event.target.files[0];
    console.log('Fichier sélectionné:', this.fichier);
  }

  onSubmit(): void {
    if (this.methodeVirement === 'file') {
      this.submitFile();
    } else {
      this.submitForm();
    }
  }
  //ne permet pas l'ecriture des lettres dans le champ montant
  numericOnly(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9.]/g, ''); // Autorise les chiffres et le point
  }
  submitFile(): void {
    if (!this.fichier) {
      Swal.fire({
        title: 'Fichier manquant',
        html: `
          <div style="text-align: center;">
            <i class="fas fa-exclamation-triangle" style="color: #ffc107; font-size: 48px; margin-bottom: 15px;"></i>
            <p>Veuillez sélectionner un fichier valide.</p>
          </div>
        `,
        confirmButtonText: 'OK',
        confirmButtonColor: '#3366cc'
      });
      return;
    }

    const formData = new FormData();
    formData.append('Fichier', this.fichier, this.fichier.name);

    // Afficher un loader pendant l'upload
    Swal.fire({
      title: 'Traitement en cours',
      html: `
        <div style="text-align: center;">
          <p>Veuillez patienter pendant le traitement du fichier...</p>
        </div>
      `,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.virementService.uploadVirementMasseFile(formData).subscribe(
      response => {
        console.log('Virement par fichier réussi:', response);

        // Fermer le loader
        Swal.close();

        // Afficher le succès
        Swal.fire({
          title: 'Succès',
          html: `
            <div style="text-align: center;">
              <i class="fas fa-check-circle" style="color: #28a745; font-size: 48px; margin-bottom: 15px;"></i>
              <p>Virement de masse effectué avec succès !</p>
              <p><strong>Nombre de virements:</strong> ${response.nombreVirements || 'Non spécifié'}</p>
              <p><strong>Montant total:</strong> ${response.totalDebite?.toFixed(2) || 'Non spécifié'} TND</p>
              <p><strong>Frais appliqués:</strong> ${response.frais || 'Non spécifié'} TND</p>
            </div>
            <div style="font-size: 13px; color: #666; margin-top: 20px; border-top: 1px solid #eee; padding-top: 10px;">
              <p><i class="fas fa-file-alt" style="color: #3366cc; margin-right: 5px;"></i> Fichier traité: ${this.fichier?.name}</p>
            </div>
          `,
          confirmButtonText: 'Fermer',
          confirmButtonColor: '#3366cc'
        });

        // Réinitialiser le formulaire
        this.fichier = null;
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
      },
      error => {
        console.error('Erreur lors du virement par fichier:', error);

        // Fermer le loader
        Swal.close();

        // Gérer différents types d'erreurs
        if (error.status === 400) {
          // Erreur de validation (fichier invalide, format incorrect, etc.)
          Swal.fire({
            title: 'Erreur dans le fichier',
            html: `
              <div style="text-align: center;">
                <i class="fas fa-file-excel" style="color: #dc3545; font-size: 48px; margin-bottom: 15px;"></i>
                <p>${error.error.message || 'Le fichier contient des erreurs.'}</p>
                ${error.error.details ? `<p style="font-size: 13px; color: #666;">${error.error.details}</p>` : ''}
              </div>
            `,
            confirmButtonText: 'Compris',
            confirmButtonColor: '#3366cc'
          });
        } else if (error.status === 404) {
          // Compte introuvable
          Swal.fire({
            title: 'Compte introuvable',
            html: `
              <div style="text-align: center;">
                <i class="fas fa-university" style="color: #dc3545; font-size: 48px; margin-bottom: 15px;"></i>
                <p>${error.error.message || 'Compte émetteur ou bénéficiaire introuvable.'}</p>
                ${error.error.rib ? `<p style="font-size: 13px;"><strong>RIB:</strong> ${error.error.rib}</p>` : ''}
              </div>
            `,
            confirmButtonText: 'Compris',
            confirmButtonColor: '#3366cc'
          });
        } else if (error.status === 402) {
          // Solde insuffisant
          Swal.fire({
            title: 'Solde insuffisant',
            html: `
              <div style="text-align: left;">
                <i class="fas fa-money-bill-wave" style="color: #dc3545; font-size: 48px; float: left; margin-right: 15px;"></i>
                <p style="text-align: left;">${error.error.message || 'Solde insuffisant pour effectuer le virement.'}</p>
                <div style="clear: both;"></div>
                <div style="margin-top: 15px; text-align: left;">
                  <p><strong>Solde disponible:</strong> ${error.error.soldeDisponible || 'Non spécifié'} TND</p>
                  <p><strong>Montant nécessaire:</strong> ${error.error.montantNecessaire || 'Non spécifié'} TND</p>
                </div>
              </div>
              <div style="font-size: 12px; color: #666; margin-top: 15px; border-top: 1px solid #eee; padding-top: 10px;">
                <p>Veuillez approvisionner votre compte ou réduire le montant du virement.</p>
              </div>
            `,
            confirmButtonText: 'Compris',
            confirmButtonColor: '#3366cc'
          });
        } else {
          // Erreur serveur inattendue
          Swal.fire({
            title: 'Erreur',
            html: `
              <div style="text-align: center;">
                <i class="fas fa-server" style="color: #dc3545; font-size: 48px; margin-bottom: 15px;"></i>
                <p>Une erreur est survenue lors du traitement du virement.</p>
                <p style="font-size: 13px; color: #666;">${error.error.message || 'Veuillez réessayer plus tard.'}</p>
              </div>
            `,
            confirmButtonText: 'Fermer',
            confirmButtonColor: '#3366cc'
          });
        }
      }
    );
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


  submitForm(): void {
    if (!this.virementForm.get('ribEmetteur')?.valid ||
      !this.virementForm.get('motif')?.valid ||
      !this.virementForm.get('beneficiaires')?.valid) {
    //if (this.virementForm.invalid) {
      Swal.fire({
        title: 'Formulaire incomplet',
        html: `
          <div style="text-align: center;">
            <i class="fas fa-exclamation-circle" style="color: #dc3545; font-size: 48px; margin-bottom: 15px;"></i>
            <p>Veuillez remplir tous les champs obligatoires correctement.</p>
          </div>
        `,
        confirmButtonText: 'Fermer',
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

    const formValue = this.virementForm.value;
    const totalMontant = formValue.beneficiaires.reduce((sum: number, benef: any) => sum + benef.montant, 0);
    const compteEmetteur = this.comptes.find(c => c.rib === formValue.ribEmetteur);

    if (!compteEmetteur) {
      return;
    }

    // Calcul des frais
    const nombreBeneficiaires = formValue.beneficiaires.length;
    let frais = 5.0; // Frais de base pour les 5 premiers bénéficiaires
    if (nombreBeneficiaires > 5) {
      frais += (nombreBeneficiaires - 5) * 0.5;
    }

    const totalAvecFrais = totalMontant + frais;
    const soldeDisponible = compteEmetteur.solde + compteEmetteur.decouvertAutorise;

    // Vérification du solde
    if (soldeDisponible < totalAvecFrais) {
      const legalText = `
        <div style="font-size: 12px; color: #666; margin-top: 15px; border-top: 1px solid #eee; padding-top: 10px;">
          <p>Veuillez approvisionner votre compte ou réduire le montant du virement.</p>
        </div>
      `;

      Swal.fire({
        title: 'Solde insuffisant',
        html: `
          <div style="text-align: left; margin: 10px 0;">
            <p><strong>Solde disponible:</strong> ${compteEmetteur.solde} TND</p>
            <p><strong>Découvert autorisé:</strong> ${compteEmetteur.decouvertAutorise} TND</p>
            <p><strong>Total à débiter:</strong> ${totalAvecFrais} TND</p>
            <p style="color: #dc3545; font-weight: 500;">Votre solde est insuffisant pour effectuer cette opération.</p>
          </div>
          ${legalText}
        `,
        icon: 'warning',
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

    // Confirmation avant envoi
    const legalText = `
      <div style="font-size: 12px; color: #666; margin-top: 15px; border-top: 1px solid #eee; padding-top: 10px;">
        <p>En confirmant, vous autorisez le débit immédiat de votre compte.</p>
      </div>
    `;

    Swal.fire({
      title: 'Confirmez le virement en masse',
      html: `
        <div style="text-align: left; margin: 10px 0;">
          <p><strong>RIB Émetteur:</strong> ${formValue.ribEmetteur}</p>
          <p><strong>Nombre de bénéficiaires:</strong> ${nombreBeneficiaires}</p>
          <p><strong>Montant total:</strong> ${totalMontant} TND</p>
          <p><strong>Frais:</strong> ${frais} TND</p>
          <p><strong>Total à débiter:</strong> ${totalAvecFrais} TND</p>
        </div>
        ${legalText}
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
        this.virementService.uploadVirementMasseForm(this.virementForm.value).subscribe(
          (response) => {
            Swal.fire({
              title: 'Virement effectué',
              html: `
                <div style="text-align: center;">
                  <i class="fas fa-check-circle" style="color: #28a745; font-size: 48px; margin-bottom: 15px;"></i>
                  <p>Votre virement de masse a été effectué avec succès.</p>
                  <p><strong>Motif:</strong> ${formValue.motif}</p>
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
          (error) => {
            Swal.fire({
              title: 'Erreur',
              html: `
                <div style="text-align: center;">
                  <i class="fas fa-exclamation-circle" style="color: #dc3545; font-size: 48px; margin-bottom: 15px;"></i>
                  <p>${error.error.message || 'Une erreur est survenue lors du virement.'}</p>
                  ${error.error.details ? `<p style="font-size: 13px; color: #666;">${error.error.details}</p>` : ''}
                </div>
              `,
              confirmButtonText: 'Fermer',
              confirmButtonColor: '#3366cc',
              customClass: {
                popup: 'swal-bank-popup'
              }
            });
          }
        );
      }
    });
  }}
