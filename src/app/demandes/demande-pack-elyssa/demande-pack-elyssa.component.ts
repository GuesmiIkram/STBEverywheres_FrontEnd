import { Component, OnInit } from '@angular/core';
import { Client } from 'src/app/Models/Client';
import { ClientService } from 'src/app/services/client.service';
import { PackService } from 'src/app/services/PackService';

interface Demand {
  id: number;
  clientId: number;
  SubmissionDate: Date;
  status: string;
  documents?: any[];
}

@Component({
  selector: 'app-demande-pack-elyssa',
  templateUrl: './demande-pack-elyssa.component.html',
  styleUrls: ['./demande-pack-elyssa.component.scss']
})
export class DemandePackElyssaComponent implements OnInit {
  public demands: Demand[] = [];
  public filteredDemands: Demand[] = [];
  public clientDetails: { [key: number]: Client } = {};
  public isGeneratingPdf = false;
  
  // Pagination variables
  public currentPage = 1;
  public itemsPerPage = 5;
  public totalItems = 0;
  
  // Filter variable
  public cinFilter = '';

  constructor(
    private packService: PackService,
    private clientService: ClientService
  ) { }

  ngOnInit(): void {
    this.loadElyssaDemands();
  }

  loadElyssaDemands(): void {
    this.packService.getElyssaDemandsByAgency().subscribe({
      next: (data: Demand[]) => {
        this.demands = data;
        this.totalItems = this.demands.length;
        this.applyFilter();
        this.demands.forEach(demand => {
          this.loadClientDetails(demand.clientId);
        });
      },
      error: (err) => {
        console.error('Erreur lors du chargement des demandes', err);
        alert('Erreur lors du chargement des demandes');
      }
    });
  }

  loadClientDetails(clientId: number): void {
    this.clientService.getClientInfoById(clientId).subscribe({
      next: (client: Client) => {
        this.clientDetails[clientId] = client;
        // Re-apply filter after client details are loaded
        this.applyFilter();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des détails du client', err);
      }
    });
  }

  applyFilter(): void {
    if (this.cinFilter) {
      this.filteredDemands = this.demands.filter(demand => {
        const client = this.clientDetails[demand.clientId];
        return client && client.numCIN?.toLowerCase().includes(this.cinFilter.toLowerCase());
      });
    } else {
      this.filteredDemands = [...this.demands];
    }
    
    this.totalItems = this.filteredDemands.length;
    this.currentPage = 1; // Reset to first page when filter changes
  }

  viewDemand(demand: Demand): void {
    this.isGeneratingPdf = true;
    this.packService.generateElyssaPdf(demand.id).subscribe({
      next: (pdfBlob: Blob) => {
        const url = window.URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `PackElyssa_Demande_${demand.id}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        this.isGeneratingPdf = false;
      },
      error: (err) => {
        console.error('Erreur lors de la génération du PDF', err);
        alert('Erreur lors de la génération du document PDF');
        this.isGeneratingPdf = false;
      }
    });
  }

  acceptDemand(demandId: number): void {
    if (confirm('Êtes-vous sûr de vouloir accepter cette demande ?')) {
      this.packService.acceptElyssaDemand(demandId).subscribe({
        next: () => {
          alert('Demande acceptée avec succès');
          this.loadElyssaDemands();
        },
        error: (err) => {
          console.error('Erreur lors de l\'acceptation', err);
          alert('Erreur lors de l\'acceptation');
        }
      });
    }
  }

  rejectDemand(demandId: number): void {
    if (confirm('Êtes-vous sûr de vouloir refuser cette demande ?')) {
      this.packService.refuseElyssaDemand(demandId).subscribe({
        next: () => {
          alert('Demande refusée avec succès');
          this.loadElyssaDemands();
        },
        error: (err) => {
          console.error('Erreur lors du refus', err);
          alert('Erreur lors du refus');
        }
      });
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'EnAttente': return 'status-pending';
      case 'Acceptee': return 'status-accepted';
      case 'Refusee': return 'status-rejected';
      default: return '';
    }
  }

  // Pagination methods
  get paginatedDemands(): Demand[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredDemands.slice(startIndex, startIndex + this.itemsPerPage);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}