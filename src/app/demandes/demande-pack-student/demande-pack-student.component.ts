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
  selector: 'app-demande-pack-student',
  templateUrl: './demande-pack-student.component.html',
  styleUrls: ['./demande-pack-student.component.scss']
})
export class DemandePackStudentComponent implements OnInit {
  public demands: Demand[] = [];
  public filteredDemands: Demand[] = [];
  public clientDetails: { [key: number]: Client } = {};
  isGeneratingPdf = false;

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
    this.loadStudentDemands();
  }

  loadStudentDemands(): void {
    this.packService.getStudentDemandsByAgency().subscribe({
      next: (data: Demand[]) => {
        this.demands = data;
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
      },
      error: (err) => {
        console.error('Erreur lors du chargement des détails du client', err);
      }
    });
  }

  viewDemand(demand: Demand): void {
    this.packService.generateStudentPdf(demand.id).subscribe({
      next: (pdfBlob: Blob) => {
        // Créer un lien et déclencher le téléchargement
        const url = window.URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `PackStudent_Demande_${demand.id}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      },
      error: (err) => {
        console.error('Erreur lors de la génération du PDF', err);
        alert('Erreur lors de la génération du document PDF');
      }
    });
  }
  acceptDemand(demandId: number): void {
    if (confirm('Êtes-vous sûr de vouloir accepter cette demande ?')) {
      this.packService.acceptStudentDemand(demandId).subscribe({
        next: () => {
          alert('Demande acceptée avec succès');
          this.loadStudentDemands();
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
      this.packService.refuseStudentDemand(demandId).subscribe({
        next: () => {
          alert('Demande refusée avec succès');
          this.loadStudentDemands();
        },
        error: (err) => {
          console.error('Erreur lors du refus', err);
          alert('Erreur lors du refus');
        }
      });
    }
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