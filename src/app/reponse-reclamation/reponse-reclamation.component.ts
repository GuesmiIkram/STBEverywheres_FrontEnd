import { Component, OnInit } from '@angular/core';
import { Reclamation } from '../Models/Reclamation';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RepondreReclamationService } from '../services/RepondreReclamation.service';
import Swal from 'sweetalert2';




@Component({
  selector: 'app-reponse-reclamation',
  templateUrl: './reponse-reclamation.component.html',
  styleUrls: ['./reponse-reclamation.component.scss']
})
export class ReponseReclamationComponent  implements OnInit{

  // Données
  reclamations: Reclamation[] = [];
  filteredReclamations: Reclamation[] = [];
  selectedReclamation?: Reclamation;
  reponseForm!: FormGroup;

  // États
  loading = false;
  successMsg = '';
  errorMsg = '';
  errorLoad = '';
  isSubmitting = false;
  searchTerm = '';

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  paginatedReclamations: Reclamation[] = [];
  pagesArray: number[] = [];

  constructor(
    private reclamationService: RepondreReclamationService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.reponseForm = this.fb.group({
      contenuReponse: ['', Validators.required],
    });
    this.getReclamations();
  }

  getReclamations() {
    this.loading = true;
    this.reclamationService.getReclamationsEnAttente().subscribe({
      next: (res: any[]) => {
        console.log("Réponse reçue du backend", res);
        this.reclamations = res.map(item => ({
          id: item.Id || item.id,
          objet: item.Objet || item.objet,
          message: item.Message || item.message,
          motif: item.Motif || item.motif,
          dateCreation: item.DateCreation ? new Date(item.DateCreation) : new Date(),
        }));

        this.filteredReclamations = [...this.reclamations];
        this.updatePagination();
        this.loading = false;
      },
      error: (err) => {
        this.errorLoad = err.error || 'Erreur de chargement des réclamations.';
        this.loading = false;
      }
    });
  }

  filterReclamations() {
    if (!this.searchTerm.trim()) {
      this.filteredReclamations = [...this.reclamations];
    } else {
      const term = this.searchTerm.toLowerCase().trim();
      this.filteredReclamations = this.reclamations.filter(rec =>
        rec.objet.toLowerCase().includes(term) ||
        rec.message.toLowerCase().includes(term)
      );
    }

    // Reset to first page when filtering
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredReclamations.length / this.itemsPerPage);

    // Create pages array for pagination buttons
    this.pagesArray = [];
    const maxVisiblePages = 5;

    if (this.totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= this.totalPages; i++) {
        this.pagesArray.push(i);
      }
    } else {
      // Show limited pages with current page in the middle when possible
      let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

      // Adjust if we're near the end
      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        this.pagesArray.push(i);
      }
    }

    // Get current page items
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedReclamations = this.filteredReclamations.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  voirDetails(rec: Reclamation) {
    console.log('Réclamation sélectionnée:', rec);
    this.selectedReclamation = rec;
    this.reponseForm.reset();
    this.successMsg = '';
    this.errorMsg = '';
  }

  envoyerReponse() {
    if (!this.selectedReclamation || this.reponseForm.invalid) return;

    this.isSubmitting = true;
    this.successMsg = '';
    this.errorMsg = '';

    const dto = {
      Id: this.selectedReclamation.id,
      contenuReponse: this.reponseForm.value.contenuReponse,
    };

    console.log('Données envoyées:', dto);

    if (!this.selectedReclamation?.id) {
      this.errorMsg = "ID de la réclamation invalide.";
      this.isSubmitting = false;
      return;
    }

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
        this.filterReclamations();

        // Fermer les détails après un court délai
        setTimeout(() => {
          this.selectedReclamation = undefined;
          this.reponseForm.reset();
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
  }}
