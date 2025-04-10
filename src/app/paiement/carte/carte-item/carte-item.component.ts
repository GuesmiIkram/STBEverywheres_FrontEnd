import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CarteDTO } from 'src/app/Models/CarteDTO';
import { DemandeAugmentationPlafondDTO } from 'src/app/Models/DemandeAugmentationPlafondDTO ';

import { CarteService } from 'src/app/services/carte.service';

interface GroupedDemandes {
  [key: string]: {
    mois: string;
    annee: number;
    demandes: DemandeAugmentationPlafondDTO[];
  };
}

@Component({
  selector: 'app-carte-item',
  templateUrl: './carte-item.component.html',
  styleUrls: ['./carte-item.component.scss']
})
export class CarteItemComponent implements OnInit {
  activeTab: string = 'demande';
  demandeForm: FormGroup;
  clientCards: CarteDTO[] = [];
  demandes: DemandeAugmentationPlafondDTO[] = [];
  demandesParMois: any[] = [];
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private carteService: CarteService,
    private fb: FormBuilder
  ) {
    this.demandeForm = this.fb.group({
      selectedCard: ['', Validators.required],
      newTPELimit: ['', [Validators.required, Validators.min(0)]],
      newDABLimit: ['', [Validators.required, Validators.min(0)]],
      requestReason: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.loadClientCards();
    this.loadDemandes();
  }

  changeTab(tab: string): void {
    this.activeTab = tab;
    if (tab === 'suivi') {
      this.loadDemandes();
    }
  }

  loadClientCards(): void {
    this.isLoading = true;
    this.carteService.getCartesByClientId().subscribe({
      next: (cards) => {
        this.clientCards = cards;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading client cards:', err);
        this.errorMessage = 'Erreur lors du chargement des cartes';
        setTimeout(() => this.errorMessage = '', 5000);
        this.isLoading = false;
      }
    });
  }

  loadDemandes(): void {
    this.isLoading = true;
    this.carteService.getDemandesAugmentation().subscribe({
      next: (demandes) => {
        this.demandes = demandes;
        this.groupDemandesParMois();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading demands:', err);
        this.errorMessage = 'Erreur lors du chargement des demandes';
        setTimeout(() => this.errorMessage = '', 5000);
        this.isLoading = false;
      }
    });
  }

  groupDemandesParMois(): void {
    const grouped: GroupedDemandes = {};
    const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
                       "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

    this.demandes.forEach((demande: DemandeAugmentationPlafondDTO) => {
      const date = new Date(demande.dateDemande);
      const mois = monthNames[date.getMonth()];
      const annee = date.getFullYear();
      const key = `${mois}-${annee}`;

      if (!grouped[key]) {
        grouped[key] = {
          mois: mois,
          annee: annee,
          demandes: []
        };
      }

      grouped[key].demandes.push(demande);
    });

    this.demandesParMois = Object.values(grouped);
    
    // Trier les groupes par date décroissante
    this.demandesParMois.sort((a, b) => {
      return new Date(b.annee, this.getMonthIndex(b.mois)).getTime() - 
             new Date(a.annee, this.getMonthIndex(a.mois)).getTime();
    });

    // Trier les demandes par date décroissante dans chaque groupe
    this.demandesParMois.forEach((group: { demandes: DemandeAugmentationPlafondDTO[] }) => {
      group.demandes.sort((a: DemandeAugmentationPlafondDTO, b: DemandeAugmentationPlafondDTO) => {
        return new Date(b.dateDemande).getTime() - new Date(a.dateDemande).getTime();
      });
    });
  }

  getMonthIndex(monthName: string): number {
    const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
                       "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
    return monthNames.indexOf(monthName);
  }

  submitRequest(): void {
    if (this.demandeForm.invalid) {
      this.errorMessage = 'Veuillez remplir tous les champs correctement';
      setTimeout(() => this.errorMessage = '', 5000);
      return;
    }

    this.isLoading = true;
    const request: DemandeAugmentationPlafondDTO = {
      numCarte: this.demandeForm.value.selectedCard,
      nouveauPlafondTPE: this.demandeForm.value.newTPELimit,
      nouveauPlafondDAB: this.demandeForm.value.newDABLimit,
      raison: this.demandeForm.value.requestReason,
      dateDemande: new Date()
    };

    this.carteService.createDemandeAugmentation(request).subscribe({
      next: (response) => {
        this.successMessage = 'Demande envoyée avec succès';
        this.demandeForm.reset();
        this.loadDemandes();
        setTimeout(() => this.successMessage = '', 5000);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error submitting request:', err);
        this.errorMessage = 'Erreur lors de l\'envoi de la demande: ' + 
          (err.error?.message || 'Veuillez réessayer plus tard');
        setTimeout(() => this.errorMessage = '', 5000);
        this.isLoading = false;
      }
    });
  }

  getFormattedStatus(status: string): string {
    switch(status?.toUpperCase()) {
      case 'APPROUVE':
        return 'Approuvé';
      case 'REFUSE':
        return 'Refusé';
      case 'EN_COURS':
        return 'En cours de traitement';
      default:
        return status || 'Inconnu';
    }
  }
}