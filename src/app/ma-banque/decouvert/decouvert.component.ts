import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DecouvertService } from 'src/app/services/decouvert.service';
import { DemandeModificationDecouvertDto } from 'src/app/Models/DemandeModificationDecouvertDto';

@Component({
  selector: 'app-decouvert',
  templateUrl: './decouvert.component.html',
  styleUrls: ['./decouvert.component.scss']
})
export class DecouvertComponent implements OnInit {
  activeTab: string = 'demande'; // Onglet actif ('demande' ou 'suivi')
  alertSymbol: string = '\u26A0'; // ⚠ (symbole Unicode)affiché si client choisit le nv decouvert=decouvet actuel

  // Variables pour le formulaire
  demandeForm: FormGroup;
  comptes: any[] = [];
  decouvertAutorise: number | null = null;
  alertSameAmount: boolean = false; // Indicateur d'alerte
  montantDemande: number | null = null;

// Variables pour le suivi des demandes
demandes: DemandeModificationDecouvertDto[] = [];
demandesParMois: { mois: string, annee: number, demandes: DemandeModificationDecouvertDto[] }[] = [];

  // Messages d'erreur/succès
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private decouvertService: DecouvertService,
    private fb: FormBuilder
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
  onCompteSelected(): void {
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
      const demandeDto: DemandeModificationDecouvertDto = {
        ribCompte: this.demandeForm.get('rib')?.value,
        decouvertDemande: this.demandeForm.get('montantDemande')?.value,
        statutDemande: 'En attente',
        dateDemande: new Date()
      };

      this.decouvertService.demandeModificationDecouvert(demandeDto).subscribe({
        next: () => {
          this.successMessage = 'Demande envoyée avec succès!';
          this.errorMessage = null;
          this.demandeForm.reset();
          this.decouvertAutorise = null;
        },
        error: (err) => {
          this.errorMessage = err.error.message || 'Erreur lors de l\'envoi.';
          this.successMessage = null;
        }
      });
    } else {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires.';
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
getFormattedStatus(statut: string): string {
  switch(statut.toLowerCase()) {
    case 'accepte':
      return 'Acceptée';
    case 'refuse':
      return 'Refusée';
    case 'en attente':
      return 'En attente';
    default:
      return statut;
  }
}

getStatusClass(statut: string): string {
  switch(statut.toLowerCase()) {
    case 'accepte':
      return 'statut-acceptee';
    case 'refuse':
      return 'statut-refusee';
    case 'en attente':
      return 'statut-en-attente';
    default:
      return '';
  }
}



}
