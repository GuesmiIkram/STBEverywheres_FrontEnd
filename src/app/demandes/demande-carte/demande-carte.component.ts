import { Component, OnInit } from '@angular/core';
import { DemandePlafondService } from 'src/app/services/DemandePlafondService';
import Swal from 'sweetalert2';

interface DemandeCarte {
  iddemande: number;
  numCompte: string;
  clientNom: string;
  clientPrenom: string;
  nomCarte: string;
  typeCarte: string;
  dateCreation: string;
  statut: string;
  email: string;
  numTel: string;
}

@Component({
  selector: 'app-demande-carte',
  templateUrl: './demande-carte.component.html',
  styleUrls: ['./demande-carte.component.scss']
})
export class DemandeCarteComponent implements OnInit {
  demandes: DemandeCarte[] = [];
  filteredDemandes: DemandeCarte[] = [];
  pagedDemandes: DemandeCarte[] = [];
  isLoading = false;
  selectedStatus: string = '';
  selectedDemandeId: number | null = null;
  accountFilter: string = '';
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  // Mappage des statuts texte vers valeurs numériques
  private readonly statusToNumberMap: {[key: string]: number} = {
    'EnCours': 0,
    'DisponibleEnAgence': 1,
    'Rejetee': 2,
    'Recuperee': 3,
    'Livree': 4,
    'EnPreparation': 5
  };

  // Mappage inverse (numérique vers texte)
  private readonly numberToStatusMap: string[] = [
    'EnCours',
    'DisponibleEnAgence',
    'Rejetee',
    'Recuperee',
    'Livree',
    'EnPreparation'
  ];

  constructor(private demandeService: DemandePlafondService) { }

  ngOnInit(): void {
    this.loadDemandes();
  }

  loadDemandes(): void {
    this.isLoading = true;
    this.demandeService.getCardDemandsByAgency().subscribe({
      next: (data: any) => {
        this.demandes = data;
        this.applyFilter();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading demandes:', err);
        this.showErrorAlert('Erreur', 'Erreur lors du chargement des demandes');
        this.isLoading = false;
      }
    });
  }

  applyFilter(): void {
    if (this.accountFilter) {
      this.filteredDemandes = this.demandes.filter(demande => 
        demande.numCompte.toLowerCase().includes(this.accountFilter.toLowerCase())
      );
    } else {
      this.filteredDemandes = [...this.demandes];
    }
    
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredDemandes.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.pagedDemandes = this.filteredDemandes.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  prepareUpdate(demandeId: number, currentStatus: string): void {
    this.selectedDemandeId = demandeId;
    
    if (!isNaN(Number(currentStatus))) {
      const statusNum = parseInt(currentStatus, 10);
      this.selectedStatus = this.numberToStatusMap[statusNum] || 'EnCours';
    } else {
      this.selectedStatus = currentStatus;
    }
  }

  updateDemandeStatus(): void {
    if (!this.selectedDemandeId || !this.selectedStatus) {
      Swal.fire({
        icon: 'warning',
        title: 'Champ manquant',
        text: 'Veuillez sélectionner un statut',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    const numericStatus = this.statusToNumberMap[this.selectedStatus] ?? 0;

    const updateDto = { 
      nouveauStatut: numericStatus,
      commentaire: ''
    };

    this.demandeService.updateCardDemandStatus(this.selectedDemandeId, updateDto)
      .subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Succès',
            text: 'Statut mis à jour avec succès',
            confirmButtonColor: '#3085d6',
            timer: 2000
          });
          this.loadDemandes();
          this.selectedDemandeId = null;
          this.selectedStatus = '';
        },
        error: (err) => {
          console.error('Error updating status:', err);
          this.showErrorAlert(
            'Erreur de mise à jour',
            this.extractErrorMessage(err)
          );
        }
      });
  }

  private extractErrorMessage(err: any): string {
    if (err.error?.errors) {
      return Object.values(err.error.errors).join('<br>');
    }
    if (err.error?.title) {
      return err.error.title;
    }
    return err.message || 'Une erreur inconnue est survenue';
  }

  private showErrorAlert(title: string, message: string): void {
    Swal.fire({
      icon: 'error',
      title: title,
      html: message,
      confirmButtonColor: '#d33',
      confirmButtonText: 'OK'
    });
  }

  getStatusLabel(status: string): string {
    const statusLabels: {[key: string]: string} = {
      'EnCours': 'En cours',
      'EnPreparation': 'En préparation',
      'DisponibleEnAgence': 'Disponible en agence',
      'Livree': 'Livrée',
      'Recuperee': 'Récupérée',
      'Rejetee': 'Rejetée'
    };
    
    if (!isNaN(Number(status))) {
      const statusNum = parseInt(status, 10);
      status = this.numberToStatusMap[statusNum] || 'EnCours';
    }

    return statusLabels[status] || status;
  }

  getStatusNumber(status: string): number {
    if (!isNaN(Number(status))) {
      return parseInt(status, 10);
    }
    return this.statusToNumberMap[status] ?? 0;
  }
  getStatusClass(status: string): string {
    if (!isNaN(Number(status))) {
      const statusNum = parseInt(status, 10);
      status = this.numberToStatusMap[statusNum] || 'EnCours';
    }

    switch (status) {
      case 'EnCours': return 'status-pending';
      case 'EnPreparation': return 'status-preparing';
      case 'DisponibleEnAgence': return 'status-available';
      case 'Livree': return 'status-delivered';
      case 'Recuperee': return 'status-completed';
      case 'Rejetee': return 'status-rejected';
      default: return '';
    }
  }
}