import { Component, HostListener, OnInit } from '@angular/core';
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
  reclamations: ReclamationResponse[] = []
  filteredReclamations: ReclamationResponse[] = []
  filterDateControl = new FormControl("")
  isLoading = false
  errorMessage = ""
  showFilters = true

  screenWidth: number
  selectedReclamation: ReclamationResponse | null = null
  showNotification = false
  notificationMessage = ""

  // Pagination
  currentPage = 1
  itemsPerPage = 6
  totalItems = 0

  constructor(
    private reclamationService: ReclamationService,
    private datePipe: DatePipe,
  ) {
    this.screenWidth = window.innerWidth
  }

  @HostListener("window:resize", ["$event"])
  onResize() {
    this.screenWidth = window.innerWidth
  }

  ngOnInit(): void {
    this.loadReclamations()


  }


  applyStatusFilter(event: Event): void {
    const selectedStatus = (event.target as HTMLSelectElement).value;

    if (selectedStatus === "all") {
      this.filteredReclamations = [...this.reclamations];
    } else {
      // Normaliser la casse pour la comparaison
      this.filteredReclamations = this.reclamations.filter((rec) =>
        rec.statut.toLowerCase() === selectedStatus.toLowerCase()
      );
    }

    this.totalItems = this.filteredReclamations.length;
    this.currentPage = 1;
  }

  private generateDateResolution(rec: ReclamationResponse): string {
    if (rec.statut.toLowerCase() === 'traite') {
      const creationDate = new Date(rec.dateCreation);
      creationDate.setDate(creationDate.getDate() + 3);
      return creationDate.toISOString();
    }
    return ''; // Returns empty string instead of undefined
  }





  loadReclamations(): void {
    this.isLoading = true
    this.reclamationService.getClientReclamations().subscribe({
      next: (data) => {
        this.reclamations = data
        console.log("reclaamtions retournes du back",this.reclamations);
        // Ajouter des propriétés supplémentaires pour la timeline
        this.reclamations = this.reclamations.map((rec) => ({
          ...rec,
          dateTraitement: this.generateDateTraitement(rec),
          dateResolution: rec.dateResolution || this.generateDateResolution(rec),
          message: this.generateMessage(rec),
        }))

        this.filteredReclamations = [...this.reclamations]
        this.totalItems = data.length
        this.isLoading = false
      },
      error: (err) => {
        this.errorMessage = "Erreur lors du chargement des réclamations"
        this.isLoading = false
        console.error(err)
      },
    })
  }

  private generateDateTraitement(rec: ReclamationResponse): string {
    if (rec.statut === "EnCours" || rec.statut === "traite" ) {
      const creationDate = new Date(rec.dateCreation)
      creationDate.setDate(creationDate.getDate() + 1)
      return creationDate.toISOString()
    }
    return ""
  }


  private generateMessage(rec: ReclamationResponse): string {
    const messages = [
      "Je souhaite signaler un problème concernant ma dernière opération bancaire.",
      "Ma carte a été refusée lors d'un paiement alors que mon compte est approvisionné.",
      "Je conteste les frais appliqués sur mon compte ce mois-ci.",
      "Je n'ai pas reçu mon nouveau chéquier commandé il y a deux semaines.",
    ]
    return messages[Math.floor(Math.random() * messages.length)]
  }

  applyDateFilter(): void {
    const filterDate = this.filterDateControl.value

    if (!filterDate) {
      this.filteredReclamations = [...this.reclamations]
    } else {
      const selectedDate = new Date(filterDate)

      this.filteredReclamations = this.reclamations.filter((reclamation) => {
        const recDate = new Date(reclamation.dateCreation)
        return (
          recDate.getFullYear() === selectedDate.getFullYear() &&
          recDate.getMonth() === selectedDate.getMonth() &&
          recDate.getDate() === selectedDate.getDate()
        )
      })
    }

    this.totalItems = this.filteredReclamations.length
    this.currentPage = 1
  }

  // Filtrer les réclamations par statut
  getReclamationsByStatus(status: string): ReclamationResponse[] {
    return this.reclamations.filter((rec) => rec.statut === status)
  }



  // Réinitialiser les filtres
  resetFilters(): void {
    this.filterDateControl.setValue("")
    this.filteredReclamations = [...this.reclamations]
    this.totalItems = this.reclamations.length
    this.currentPage = 1
  }

  // Pagination methods
  get paginatedReclamations(): ReclamationResponse[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage
    return this.filteredReclamations.slice(startIndex, startIndex + this.itemsPerPage)
  }

  pageChanged(page: number): void {
    this.currentPage = page
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage)
  }

  // Pagination dynamique avec ellipses si besoin
  getPaginationRange(): (number | string)[] {
    const totalPages = this.totalPages
    const current = this.currentPage
    const delta = 2
    const range: (number | string)[] = []

    for (let i = Math.max(2, current - delta); i <= Math.min(totalPages - 1, current + delta); i++) {
      range.push(i)
    }

    if (current - delta > 2) {
      range.unshift("...")
    }
    if (current + delta < totalPages - 1) {
      range.push("...")
    }

    if (totalPages > 1) {
      range.unshift(1)
      if (!range.includes(totalPages)) {
        range.push(totalPages)
      }
    }

    return range
  }


  formatDate(dateString: string): string {
    // Remplace l'espace par "T" pour qu'Angular DatePipe comprenne le format ISO
    const fixedDate = dateString.replace(' ', 'T')
    return this.datePipe.transform(fixedDate, "dd/MM/yyyy HH:mm") || ""
  }

  // Méthodes pour la vue adaptative
  toggleFilters(): void {
    this.showFilters = !this.showFilters
  }



  // Méthodes pour le modal de détail
  openReclamationDetail(reclamation: ReclamationResponse): void {
    this.selectedReclamation = reclamation

  }

  closeReclamationDetail(): void {
    this.selectedReclamation = null
  }




}
