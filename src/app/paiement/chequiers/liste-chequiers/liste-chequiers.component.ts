import { Component, OnInit } from '@angular/core';
import { ChequierService } from 'src/app/services/Chequier.service';
import { DemandeChequierService } from 'src/app/services/DemandeChequier.service';

@Component({
  selector: 'app-liste-chequiers',
  templateUrl: './liste-chequiers.component.html',
  styleUrls: ['./liste-chequiers.component.scss']
})
export class ListechequiersComponent implements OnInit {

  chequiers: any[] = [];
  selectedChequier: any = null;
  feuilles: any[] = [];
  isLoadingChequiers = true;
  isLoadingFeuilles = false;
  errorChequiers: string | null = null;
  errorFeuilles: string | null = null;
  showDetailsModal = false;
  demandesStatuts: { [key: string]: string } = {};

  constructor(
    private chequierService: ChequierService,
    private demandeChequierService: DemandeChequierService
  ) {}

  ngOnInit(): void {
    this.loadChequiers();
  }

  formatFeuilleNumber(numero: string): string {
    if (numero && numero.length > 12) {
      return `${numero.substring(0, 6)}...${numero.substring(numero.length - 6)}`;
    }
    return numero;
  }

  loadChequiers(): void {
    this.isLoadingChequiers = true;
    this.errorChequiers = null;

    this.chequierService.getChequesParClient().subscribe({
      next: (data) => {
        this.chequiers = data || [];
        this.isLoadingChequiers = false;

        // Vérification des données reçues
        console.log('Liste des chéquiers:', this.chequiers);

        this.chequiers.forEach((chequier) => {
          const id = chequier.demandeChequierId;
          if (!id) {
            console.warn('Chequier sans demandeChequierId:', chequier);
            return;
          }

          console.log(`Récupération statut pour demande ID: ${id}`);

          this.demandeChequierService.GetDemandeById(id).subscribe({
            next: (demande) => {
              console.log('Détails demande reçus:', demande);

              // Modification clé ici - la réponse est l'objet direct, pas un tableau
              const statut = demande?.[0]?.status || '';

              console.log(`Statut à enregistrer pour ${id}:`, statut);

              // Mise à jour immuable de demandesStatuts
              this.demandesStatuts = {
                ...this.demandesStatuts,
                [id]: statut
              };

              // Vérification après mise à jour
              console.log('demandesStatuts après update:', this.demandesStatuts);
            },
            error: (err) => {
              console.error(`Erreur récupération demande ${id}:`, err);
              this.demandesStatuts = {
                ...this.demandesStatuts,
                [id]: ''
              };
            }
          });
        });
      },
      error: (err) => {
        console.error('Erreur chargement chéquiers:', err);
        this.isLoadingChequiers = false;
        if (err.status === 404) {
          this.chequiers = [];
        } else {
          this.errorChequiers = 'Erreur lors du chargement des chéquiers';
        }
      }
    });
  }

  showFeuillesDetails(chequier: any): void {
    this.selectedChequier = chequier;
    this.isLoadingFeuilles = true;
    this.errorFeuilles = null;
    this.showDetailsModal = true;

    this.chequierService.getFeuillesParChequier(chequier.demandeChequierId).subscribe({
      next: (data) => {
        this.feuilles = data;
        this.isLoadingFeuilles = false;
      },
      error: (err) => {
        this.errorFeuilles = 'Erreur lors du chargement des feuilles';
        console.error(err);
        this.isLoadingFeuilles = false;
      }
    });
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedChequier = null;
    this.feuilles = [];
  }


  getStatusText(status: string): string {
    console.log('Conversion du statut:', status); // Log 10
    if (!status) return 'Statut inconnu';

    switch(status) {
      case 'EnCoursPreparation':
        return 'En cours de préparation';
      case 'DisponibleEnAgence':
        return 'Disponible en agence';
      case 'RemisAuClient':
        return 'Remis au client';
      case 'Expedie':
        return 'Expédié par courrier';
      default:
        console.warn('Statut non reconnu:', status); // Log 11
        return status;
    }
  }


}
