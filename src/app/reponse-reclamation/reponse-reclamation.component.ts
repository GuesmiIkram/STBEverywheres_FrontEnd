import { Component, OnInit } from '@angular/core';
import { Reclamation } from '../Models/Reclamation';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RepondreReclamationService } from '../services/RepondreReclamation.service';
import Swal from 'sweetalert2';
import { Client } from '../Models/Client';

import { ClientService } from '../services/client.service';



@Component({
  selector: 'app-reponse-reclamation',
  templateUrl: './reponse-reclamation.component.html',
  styleUrls: ['./reponse-reclamation.component.scss']
})
export class ReponseReclamationComponent implements OnInit {
  reclamations: Reclamation[] = [];
  clientInfo?: Client;

  filteredReclamations: Reclamation[] = [];
  selectedReclamation?: Reclamation;
  reponseForm: FormGroup;

  loading = false;
  successMsg = '';
  errorMsg = '';
  errorLoad = '';
  isSubmitting = false;
  searchTerm = '';
  filterType = 'all';
  viewMode = 'table';
  sortField = 'dateCreation';
  sortDirection = 'desc';

  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  paginatedReclamations: Reclamation[] = [];
  pagesArray: (number | string)[] = [];


  constructor(
    private reclamationService: RepondreReclamationService,
    private clientService: ClientService,
    private fb: FormBuilder
  ) {
    this.reponseForm = this.fb.group({
      contenuReponse: ['', Validators.required],

    });
  }

  ngOnInit(): void {
    this.getReclamations();
  }

  initForm(): void {
    this.reponseForm = this.fb.group({
      contenuReponse: ['', Validators.required],

    });
  }
  getReclamations(): void {
    this.loading = true;
    this.errorLoad = ''; // Réinitialiser le message d'erreur

    this.reclamationService.getReclamationsEnAttente().subscribe({
      next: (res: any[]) => {
        console.log('Réponse du backend:', res);

        // Cas où il n'y a aucune réclamation (tableau vide)
        if (res.length === 0) {
          this.reclamations = [];
          this.filteredReclamations = [];
          this.loading = false;
          return;
        }

        this.reclamations = res.map(item => ({
          id: (item.Id || item.id).toString(),
          objet: item.Objet || item.objet,
          message: item.Message || item.message,
          description: item.Description || item.description,
          motif: item.Motif || item.motif,
          dateCreation: item.dateCreation ? new Date(item.dateCreation) : new Date(),
          dateResolution: item.DateResolution ? new Date(item.DateResolution) : undefined,
          priorite: this.assignPriority(item),
          reponse: item.Reponse || item.reponse,
          statut: item.Statut || item.statut,
          reference: item.Reference || item.reference,
          clientId: item.clientId
        }));

        this.applyFilter();
        this.updatePagination();
        this.loading = false;
      },
      error: (err) => {
        // Ne pas afficher d'erreur si c'est une 404 (aucune réclamation)
        if (err.status === 404) {
          this.reclamations = [];
          this.filteredReclamations = [];
          this.errorLoad = '';
        } else {
          this.errorLoad = err.error?.message || 'Erreur de chargement des réclamations';
        }
        this.loading = false;
      }
    });
  }

  private assignPriority(item: any): 'high' | 'medium' | 'low' {
    const content = `${item.Objet} ${item.Message}`.toLowerCase();
    const highPriorityKeywords = ['urgent', 'critique', 'bloquant'];
    const mediumPriorityKeywords = ['important', 'problème', 'erreur'];

    if (highPriorityKeywords.some(kw => content.includes(kw))) return 'high';
    if (mediumPriorityKeywords.some(kw => content.includes(kw))) return 'medium';
    return 'low';
  }



  sortBy(field: string): void {
    if (this.sortField === field) {
      // Inverser la direction si on clique sur le même champ
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }

    this.updatePagination();
  }



  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredReclamations.length / this.itemsPerPage);
    this.pagesArray = this.calculatePaginationRange();

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedReclamations = this.filteredReclamations.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  applyFilter(): void {
    if (this.filterType === 'all') {
      this.filteredReclamations = [...this.reclamations];
    } else {
      this.filteredReclamations = this.reclamations.filter(rec =>
        rec.motif?.toLowerCase().includes(this.filterType.toLowerCase())
      );
    }

    // Toujours mettre à jour la pagination après filtrage
    this.currentPage = 1; // revenir à la première page
    this.updatePagination();
  }


  voirDetails(rec: Reclamation): void {
    console.log('Réclamation sélectionnée:', rec);
    this.selectedReclamation = rec;
    this.reponseForm.reset({
      contenuReponse: '',

    });
    this.successMsg = '';
    this.errorMsg = '';

    // Appel pour récupérer les infos client
    this.clientService.getClientInfoById(rec.clientId).subscribe({
      next: (client) => {
        this.clientInfo = client;
      },
      error: (err) => {
        console.error('Erreur chargement client :', err);
        this.clientInfo = undefined;
      }
    });
  }


  closeModal(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.selectedReclamation = undefined;
    }
  }
  private calculatePaginationRange(): (number | string)[] {
    const range: (number | string)[] = [];
    const delta = 2;

    for (let i = Math.max(2, this.currentPage - delta);
         i <= Math.min(this.totalPages - 1, this.currentPage + delta);
         i++) {
      range.push(i);
    }

    if (this.currentPage - delta > 2) range.unshift('...');
    if (this.currentPage + delta < this.totalPages - 1) range.push('...');

    return [1, ...range, this.totalPages];
  }



  // Les autres méthodes restent inchangées...
  envoyerReponse(): void {
    if (!this.selectedReclamation || this.reponseForm.invalid) return;

    this.isSubmitting = true;
    this.successMsg = '';
    this.errorMsg = '';

    const dto = {
      Id: this.selectedReclamation.id,
      contenuReponse: this.reponseForm.value.contenuReponse,

    };

    console.log('Données envoyées:', dto);

    this.reclamationService.repondreAReclamation(dto).subscribe({
      next: (res) => {
        console.log('Réponse backend:', res);

        // Afficher le message de succès
        this.successMsg = res.message || 'Réponse envoyée au client avec succès.';

        // Swal de succès
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: this.successMsg,
          timer: 3000,
          showConfirmButton: false
        });

        // Mettre à jour la liste des réclamations
        this.reclamations = this.reclamations.filter(
          (r) => r.id !== this.selectedReclamation?.id
        );

        // Mettre à jour la liste filtrée et la pagination

        // Fermer les détails après un court délai
        setTimeout(() => {
          this.selectedReclamation = undefined;
        }, 2000);

        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('Erreur Angular:', err);

        let messageErreur = 'Erreur lors de l\'envoi.';
        if (typeof err.error === 'string') {
          messageErreur = err.error;
        } else if (err.error?.message) {
          messageErreur = err.error.message;
        }

        this.errorMsg = messageErreur;

        // Swal d'erreur
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: messageErreur
        });

        this.isSubmitting = false;
      }
    });
  }

  saveAsDraft(): void {
    // Implémenter la sauvegarde comme brouillon
    Swal.fire({
      icon: 'info',
      title: 'Brouillon enregistré',
      text: 'Votre réponse a été enregistrée comme brouillon',
      timer: 2000,
      showConfirmButton: false
    });
  }


  getPreview(text: string, maxLength: number = 50): string {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }


  getRecentCount(): number {
    const now = new Date();
    return this.reclamations.filter(rec => {
      const hoursDiff = (now.getTime() - rec.dateCreation.getTime()) / (1000 * 60 * 60);
      return hoursDiff < 24;
    }).length;
  }



// Add this method to your component class
getPageNumber(page: number | string): number {
  return typeof page === 'number' ? page : Number(page);
}

// Ensure changePage expects a number
changePage(page: number) {
  if (page >= 1 && page <= this.totalPages) {
    this.currentPage = page;
    // Update your paginated data here
  }
}

getTodayCount(): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Début de la journée

  return this.reclamations.filter(rec => {
    const recDate = new Date(rec.dateCreation);
    recDate.setHours(0, 0, 0, 0);
    return recDate.getTime() === today.getTime();
  }).length;
}

getOldestPendingDays(): number {
  if (this.reclamations.length === 0) return 0;

  const now = new Date();
  let oldestDays = 0;

  this.reclamations.forEach(rec => {
    const daysDiff = Math.floor((now.getTime() - new Date(rec.dateCreation).getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff > oldestDays) {
      oldestDays = daysDiff;
    }
  });

  return oldestDays;
}
  // Utilitaire pour Math dans le template
  get Math() {
    return Math;
  }
}
