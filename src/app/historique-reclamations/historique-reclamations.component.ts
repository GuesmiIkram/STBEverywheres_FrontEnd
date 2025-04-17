import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ReclamationService } from '../services/ReclamationService';
import { ReclamationResponse } from '../Models/ReclamationResponse';

@Component({
  selector: 'app-historique-reclamations',
  templateUrl: './historique-reclamations.component.html',
  styleUrls: ['./historique-reclamations.component.scss'],
  providers: [DatePipe]
})
export class HistoriqueReclamationsComponent implements OnInit {
  reclamations: ReclamationResponse[] = [];
  filteredReclamations: ReclamationResponse[] = [];
  filterDateControl = new FormControl('');
  isLoading = false;
  errorMessage = '';

  // Pagination
  currentPage = 1;
  itemsPerPage = 5;
  totalItems = 0;

  constructor(
    private reclamationService: ReclamationService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.loadReclamations();
  }

  loadReclamations(): void {
    this.isLoading = true;
    this.reclamationService.getClientReclamations().subscribe({
      next: (data) => {
        this.reclamations = data;
        this.filteredReclamations = [...data];
        this.totalItems = data.length;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des réclamations';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  applyDateFilter(): void {
    const filterDate = this.filterDateControl.value;
    
    if (!filterDate) {
      this.filteredReclamations = [...this.reclamations];
    } else {
      const selectedDate = new Date(filterDate);
      
      this.filteredReclamations = this.reclamations.filter(reclamation => {
        const recDate = new Date(reclamation.dateCreation);
        return (
          recDate.getFullYear() === selectedDate.getFullYear() &&
          recDate.getMonth() === selectedDate.getMonth() &&
          recDate.getDate() === selectedDate.getDate()
        );
      });
    }

    this.totalItems = this.filteredReclamations.length;
    this.currentPage = 1;
  }

  // Pagination methods
  get paginatedReclamations(): ReclamationResponse[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredReclamations.slice(startIndex, startIndex + this.itemsPerPage);
  }

  pageChanged(page: number): void {
    this.currentPage = page;
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  formatDate(dateString: string): string {
    return this.datePipe.transform(dateString, 'dd/MM/yyyy HH:mm') || '';
  }
}