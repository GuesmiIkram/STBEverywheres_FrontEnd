import { Component, OnInit } from '@angular/core';
import { Client } from 'src/app/Models/Client';
import { ClientService } from 'src/app/services/client.service';
import { PackService } from 'src/app/services/PackService';
import Swal from 'sweetalert2';

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
    this.loadAllData();
  }

  // Nouvelle méthode pour charger toutes les données
  loadAllData(): void {
    this.loadElyssaDemands();
  }

  loadElyssaDemands(): void {
    this.packService.getElyssaDemandsByAgency().subscribe({
      next: (data: Demand[]) => {
        this.demands = data;
        this.totalItems = this.demands.length;
        this.applyFilter();
        
        // Charger les détails clients pour toutes les demandes
        this.loadAllClientDetails();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des demandes', err);
       
      }
    });
  }

  // Charger tous les détails clients en une fois
  loadAllClientDetails(): void {
    // Réinitialiser les détails clients avant de recharger
    this.clientDetails = {};
    
    const uniqueClientIds = [...new Set(this.demands.map(d => d.clientId))];
    
    uniqueClientIds.forEach(clientId => {
      this.clientService.getClientInfoById(clientId).subscribe({
        next: (client: Client) => {
          this.clientDetails[clientId] = client;
          // Réappliquer le filtre après chaque chargement de client
          this.applyFilter();
        },
        error: (err) => {
          console.error(`Erreur lors du chargement du client ${clientId}`, err);
        }
      });
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
    // Garder la page actuelle si possible, sinon revenir à la première page
    const maxPage = Math.ceil(this.totalItems / this.itemsPerPage) || 1;
    if (this.currentPage > maxPage) {
      this.currentPage = 1;
    }
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
      
        this.isGeneratingPdf = false;
      }
    });
  }

  acceptDemand(demandId: number): void {
    Swal.fire({
      title: 'Confirmation',
      text: 'Êtes-vous sûr de vouloir accepter cette demande ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, accepter',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.packService.acceptElyssaDemand(demandId).subscribe({
          next: () => {
            Swal.fire(
              'Acceptée!',
              'La demande a été acceptée avec succès.',
              'success'
            ).then(() => {
              // Recharger toutes les données après acceptation
              this.loadAllData();
            });
          },
          error: (err) => {
            console.error('Erreur lors de l\'acceptation', err);
           
          }
        });
      }
    });
  }
  
  rejectDemand(demandId: number): void {
    Swal.fire({
      title: 'Confirmation',
      text: 'Êtes-vous sûr de vouloir refuser cette demande ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, refuser',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.packService.refuseElyssaDemand(demandId).subscribe({
          next: () => {
            Swal.fire(
              'Refusée!',
              'La demande a été refusée avec succès.',
              'success'
            ).then(() => {
              // Recharger toutes les données après refus
              this.loadAllData();
            });
          },
          error: (err) => {
            console.error('Erreur lors du refus', err);
            Swal.fire(
              'Erreur!',
              'Une erreur est survenue lors du refus.',
              'error'
            );
          }
        });
      }
    });
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