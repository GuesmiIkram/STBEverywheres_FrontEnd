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
        Swal.close();
        this.demands = data;
        this.totalItems = this.demands.length;
        this.applyFilter();
        this.demands.forEach(demand => {
          this.loadClientDetails(demand.clientId);
        });
      },
      error: (err) => {
        console.error('Erreur lors du chargement des demandes', err);
        
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
    this.isGeneratingPdf = true;
    Swal.fire({
      title: 'Génération du PDF...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.packService.generateStudentPdf(demand.id).subscribe({
      next: (pdfBlob: Blob) => {
        Swal.close();
        const url = window.URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `PackStudent_Demande_${demand.id}.pdf`;
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
        Swal.fire({
          title: 'Traitement en cours...',
          allowOutsideClick: false,
        
        });

        this.packService.acceptStudentDemand(demandId).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Succès',
              text: 'Demande acceptée avec succès',
              confirmButtonColor: '#3085d6'
            });
            this.loadStudentDemands();
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
        Swal.fire({
          title: 'Traitement en cours...',
          allowOutsideClick: false,
        
        });

        this.packService.refuseStudentDemand(demandId).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Succès',
              text: 'Demande refusée avec succès',
              confirmButtonColor: '#3085d6'
            });
            this.loadStudentDemands();
          },
          error: (err) => {
            console.error('Erreur lors du refus', err);
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: 'Erreur lors du refus',
              confirmButtonColor: '#3085d6'
            });
          }
        });
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
    this.currentPage = 1;
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