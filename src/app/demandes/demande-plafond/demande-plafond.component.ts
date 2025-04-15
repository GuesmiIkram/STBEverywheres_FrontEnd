import { Component } from '@angular/core';
import { DemandePlafondService } from 'src/app/services/DemandePlafondService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-demande-plafond',
  templateUrl: './demande-plafond.component.html',
  styleUrls: ['./demande-plafond.component.scss']
})
export class DemandePlafondComponent {
  demandes: any[] = [];
  hasLoaded = false;

  // Variables de pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  constructor(private demandePlafondService: DemandePlafondService) {}

  ngOnInit(): void {
    this.loadDemandes();
  }

  loadDemandes(): void {
    this.hasLoaded = false;
    this.demandePlafondService.getPendingDemands().subscribe({
      next: (data) => {
        this.demandes = data || [];
        this.calculateTotalPages();
        this.hasLoaded = true;
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.demandes = [];
        this.hasLoaded = true;
        if (err.status && err.status !== 404) {
          this.showError('Erreur lors du chargement des demandes');
        }
      }
    });
  }

  // Méthodes de pagination
  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.demandes.length / this.itemsPerPage);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getStartIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  getEndIndex(): number {
    const end = this.currentPage * this.itemsPerPage;
    return end > this.demandes.length ? this.demandes.length : end;
  }

  get paginatedDemandes(): any[] {
    const start = this.getStartIndex();
    const end = this.getEndIndex();
    return this.demandes.slice(start, end);
  }

  getVisiblePages(): number[] {
    const totalPages = this.totalPages;
    const currentPage = this.currentPage;

    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5];
    } else if (currentPage >= totalPages - 2) {
      return Array.from({ length: 5 }, (_, i) => totalPages - 4 + i);
    } else {
      return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
    }
  }

  getStatusClass(statut: string): string {
    const statusClasses: { [key: string]: string } = {
      EnAttente: 'status-pending',
      Approuvee: 'status-approved',
      Rejetee: 'status-rejected'
    };
    return statusClasses[statut] || '';
  }

  async traiterDemande(demandeId: number, action: 'Approuvee' | 'Rejetee'): Promise<void> {
    const needsComment = action === 'Rejetee';
    let comment = '';

    if (needsComment) {
      const { value } = await Swal.fire({
        title: 'Raison du refus',
        input: 'textarea',
        inputPlaceholder: 'Entrez la raison du refus...',
        showCancelButton: true,
        inputValidator: (value) => !value && 'La raison du refus est obligatoire'
      });

      if (value === undefined) return;
      comment = value || '';
    }

    const confirmation = await Swal.fire({
      title: 'Confirmer la décision',
      text: `Voulez-vous vraiment ${action === 'Approuvee' ? 'approuver' : 'refuser'} cette demande?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Confirmer'
    });

    if (confirmation.isConfirmed) {
      this.demandePlafondService.respondToDemand({
        demandeId,
        nouveauStatut: action,
        commentaire: comment
      }).subscribe({
        next: () => {
          this.showSuccess('Demande traitée avec succès');
          this.loadDemandes();
          this.currentPage = 1;
        },
        error: (err) => this.showError(err.error?.message || 'Erreur lors du traitement')
      });
    }
  }

  private showSuccess(message: string): void {
    Swal.fire('Succès', message, 'success');
  }

  private showError(message: string): void {
    Swal.fire('Erreur', message, 'error');
  }
}