import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DecouvertService } from 'src/app/services/decouvert.service';
import { DemandeModificationDecouvertDto } from 'src/app/Models/DemandeModificationDecouvertDto';
import { DemandeModifDecouvertStatut } from 'src/app/enums/DemandeModifDecouvertStatut.enum';

import Swal from 'sweetalert2';
@Component({
  selector: 'app-decouvert',
  templateUrl: './decouvert.component.html',
  styleUrls: ['./decouvert.component.scss']
})
export class DecouvertComponent implements OnInit {
  activeTab: string = 'demande'; // Onglet actif ('demande' ou 'suivi')
  alertSymbol: string = '\u26A0'; // ⚠ (symbole Unicode)affiché si client choisit le nv decouvert=decouvet actuel
  decouvertMaxAutorise: number | null = null;
  // Variables pour le formulaire
  demandeForm: FormGroup;
  comptes: any[] = [];
  decouvertAutorise: number | null = null;
  alertSameAmount: boolean = false; // Indicateur d'alerte
  montantDemande: number | null = null;
  sliderMaxValue: number = 4000;
// Variables pour le suivi des demandes
demandes: DemandeModificationDecouvertDto[] = [];
demandesParMois: { mois: string, annee: number, demandes: DemandeModificationDecouvertDto[] }[] = [];

  // Messages d'erreur/succès
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private decouvertService: DecouvertService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.demandeForm = this.fb.group({
      rib: ['', Validators.required],
      montantDemande: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.loadComptes();
    this.loadDemandes();
  }

  // Charger la liste des comptes
  loadComptes(): void {
    this.decouvertService.getComptes().subscribe({
      next: (data) => {
        this.comptes = data;
        this.errorMessage = null;
      },
      error: (err) => {
        this.errorMessage = err.message;
      }
    });
  }

  // Récupérer le découvert autorisé pour un RIB spécifique
  /*onCompteSelected(): void {
    const rib = this.demandeForm.get('rib')?.value;
    if (rib) {
      this.decouvertAutorise = null; // Réinitialiser pendant le chargement
      this.decouvertService.getDecouvertAutorise(rib).subscribe({
        next: (data) => {
          this.decouvertAutorise = data.decouvertAutorise;
          this.errorMessage = null;
          this.checkSameOverdraft();
        },
        error: (err) => {
          this.decouvertAutorise = null;
          this.errorMessage = err.message;
        }
      });
    } else {
      this.decouvertAutorise = null;
    }
  }*/


    onCompteSelected(): void {
      const rib = this.demandeForm.get('rib')?.value;
      if (rib) {
        this.decouvertAutorise = null; // Réinitialiser pendant le chargement
        this.decouvertMaxAutorise = null; // Réinitialiser aussi le max

        this.decouvertService.getDecouvertAutorise(rib).subscribe({
          next: (data) => {
            this.decouvertAutorise = data.decouvertAutorise;
            // Récupérer aussi le revenu mensuel pour calculer le max
            this.decouvertService.getClientInfo().subscribe({
              next: (clientInfo) => {
                if (clientInfo && clientInfo.revenuMensuel) {
                  this.decouvertMaxAutorise = clientInfo.revenuMensuel * 2;
                  console.log("decouvertMaxAutorise",this.decouvertMaxAutorise);
                  this.sliderMaxValue = this.decouvertMaxAutorise;
                  this.cdr.detectChanges();

                  // Mettre à jour la valeur max du slider
                  this.demandeForm.get('montantDemande')?.setValidators([
                    Validators.required,
                    Validators.min(0),
                    Validators.max(this.decouvertMaxAutorise)
                  ]);
                  this.demandeForm.get('montantDemande')?.updateValueAndValidity();
                }
              }
            });
            this.errorMessage = null;
            this.checkSameOverdraft();
          },
          error: (err) => {
            this.decouvertAutorise = null;
            this.decouvertMaxAutorise = null;
            this.errorMessage = err.message;
          }
        });
      } else {
        this.decouvertAutorise = null;
        this.decouvertMaxAutorise = null;
      }
    }

  // Vérifie si le montant demandé est égal au découvert autorisé
  checkSameOverdraft(): void {
    const montantDemande = this.demandeForm.get('montantDemande')?.value;
    this.alertSameAmount = montantDemande === this.decouvertAutorise;
  }

  // Gérer le changement du slider
  onSliderChange(event: Event): void {
    const newValue = Number((event.target as HTMLInputElement).value);
    this.demandeForm.get('montantDemande')?.setValue(newValue);
    this.checkSameOverdraft();
  }

  // Gérer la saisie manuelle du montant
  onMontantInputChange(): void {
    this.checkSameOverdraft();
  }

  // Envoyer la demande de modification

    demandeModificationDecouvert(): void {
      if (this.demandeForm.valid) {
        const rib = this.demandeForm.get('rib')?.value;
        const montant = this.demandeForm.get('montantDemande')?.value;

        const compteSelectionne = this.comptes.find(c => c.rib === rib);
        const typeCompte = compteSelectionne ? compteSelectionne.type : 'Compte';


        const legalText = `
          <div style="font-size: 12px; color: #666; margin-top: 15px; border-top: 1px solid #eee; padding-top: 10px;">
            <p>En confirmant, vous reconnaissez avoir pris connaissance des <a href="/conditions-decouvert" style="color: #0056b3; text-decoration: none;">conditions générales de découvert</a>.</p>
            <p style="margin-top: 5px;">Toute autorisation de découvert est soumise à l'approbation de notre service risques et peut être refusée.</p>
          </div>
        `;

        Swal.fire({
          title: 'Confirmez votre demande de découvert',
          html: `
            <div style="text-align: left; margin: 10px 0;">
              <p><strong>Type de compte:</strong> ${typeCompte}</p>
              <p><strong>RIB:</strong> ${rib}</p>
              <p><strong>Montant demandé:</strong> ${montant} TND</p>
            </div>
            ${legalText}
          `,
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3366cc',
          cancelButtonColor: '#6c757d',
          confirmButtonText: 'Confirmer la demande',
          cancelButtonText: 'Annuler',
          focusCancel: true,
          customClass: {
            container: 'swal-bank-container',
            popup: 'swal-bank-popup',
            htmlContainer: 'swal-bank-html'
          }
        }).then((result) => {
          if (result.isConfirmed) {
            const demandeDto: DemandeModificationDecouvertDto = {
              ribCompte: rib,
              decouvertDemande: montant,
              statutDemande: DemandeModifDecouvertStatut.EN_ATTENTE,
              dateDemande: new Date()
            };

            this.decouvertService.demandeModificationDecouvert(demandeDto).subscribe({
              next: () => {
                Swal.fire({
                  title: 'Demande enregistrée',
                  html: `
                    <div style="text-align: center;">
                      <i class="fas fa-check-circle" style="color: #28a745; font-size: 48px; margin-bottom: 15px;"></i>
                      <p>Votre demande de découvert a bien été transmise à notre service.</p>
                      <p><strong>Vous recevrez un email dès que la décision (acceptation ou refus) sera prise.</strong></p>
                    </div>
                    <div style="font-size: 13px; color: #666; margin-top: 20px; border-top: 1px solid #eee; padding-top: 10px;">
                      <p><i class="far fa-clock" style="color: #3366cc; margin-right: 5px;"></i> Délai de traitement : généralement sous 48h ouvrées.</p>
                      <p><i class="fas fa-user-tie" style="color: #3366cc3; margin-right: 5px;"></i> Pour toute question, contactez votre conseiller.</p>
                    </div>
                  `,

                  confirmButtonText: 'Compris',
                  confirmButtonColor: '#3366cc',
                  customClass: {
                    popup: 'swal-bank-popup-success'
                  }
                });

                // Réinitialisation du formulaire
                this.successMessage = 'Demande envoyée avec succès!';
                this.errorMessage = null;
                this.demandeForm.reset();
                this.decouvertAutorise = null;
                this.loadDemandes();
              },
              error: (err) => {
                Swal.fire({
                  title: 'Erreur',
                  text: err.error.message || 'Une erreur est survenue lors du traitement de votre demande.',
                  icon: 'error',
                  confirmButtonText: 'Fermer'
                });
              }
            });
          }
        });
      } else {
        this.errorMessage = 'Veuillez remplir tous les champs obligatoires correctement.';
      }
    }
  // Changer d'onglet
  changeTab(tab: string): void {
    this.activeTab = tab;
    this.errorMessage = null;
    this.successMessage = null;
  }

// Charger les demandes existantes
loadDemandes(): void {
  this.decouvertService.getDemandesByClient().subscribe({
    next: (data) => {
      console.log("Demandes reçues du backend :", data);
      this.demandes = data.sort((a, b) => new Date(b.dateDemande).getTime() - new Date(a.dateDemande).getTime());

      this.demandesParMois = [];
      this.demandes.forEach(demande => {
        const date = new Date(demande.dateDemande);
        const mois = date.toLocaleString('fr-FR', { month: 'long' });
        const annee = date.getFullYear();

        let groupe = this.demandesParMois.find(g => g.mois === mois && g.annee === annee);
        if (!groupe) {
          groupe = { mois, annee, demandes: [] };
          this.demandesParMois.push(groupe);
        }
        groupe.demandes.push(demande);
      });
    },
    error: (err) => {
      console.error("Erreur lors du chargement des demandes :", err);
      this.errorMessage = err.message;
    }
  });
}
//pour formater le statut de la demande dans la liste des demande accepte de back s'affiche acceptée...

getFormattedStatus(statut: number): string {
  switch(statut) {
    case 1: return 'Acceptée';
    case 2: return 'Refusée';
    case 0:
    default: return 'En attente';
  }
}

getStatusClass(statut: number): string {
  switch(statut) {
    case 1: return 'statut-acceptee';
    case 2: return 'statut-refusee';
    case 0:
    default: return 'statut-en-attente';
  }

}
}
