import { Component, OnInit } from '@angular/core';
import { HistoriqueRechargeDto } from 'src/app/Models/HistoriqueRechargeDto';
import { CarteService } from 'src/app/services/carte.service'; // Retirez "type" de l'import

@Component({
  selector: 'app-historique-recharges',
  templateUrl: './historique-recharges.component.html',
  styleUrls: ['./historique-recharges.component.scss']
})
export class HistoriqueRechargesComponent implements OnInit {
  historiques: HistoriqueRechargeDto[] = []
  isLoading = true
  errorMessage: string | null = null
  filteredHistoriques: HistoriqueRechargeDto[] = []
  searchTerm = ""

  // Pagination
  currentPage = 1
  itemsPerPage = 10
  totalItems = 0
  Math = Math // Pour utiliser Math dans le template

  constructor(private carteService: CarteService) {}

  ngOnInit(): void {
    this.loadHistoriques()
  }

  loadHistoriques(): void {
    this.isLoading = true
    this.errorMessage = null

    this.carteService.getHistorique().subscribe({
      next: (data) => {
        this.historiques = data
        this.filteredHistoriques = [...this.historiques]
        this.totalItems = this.historiques.length
        this.isLoading = false
      },
      error: (err) => {
        console.error("Erreur:", err)
        this.errorMessage = "Erreur lors du chargement de l'historique"
        this.isLoading = false
      },
    })
  }

  applyFilter(): void {
    if (!this.searchTerm) {
      this.filteredHistoriques = [...this.historiques]
    } else {
      const term = this.searchTerm.toLowerCase()
      this.filteredHistoriques = this.historiques.filter(
        (h) => h.carteEmetteurNum.toLowerCase().includes(term) || h.carteRecepteurNum.toLowerCase().includes(term),
      )
    }
    this.currentPage = 1
    this.totalItems = this.filteredHistoriques.length
  }

  changeItemsPerPage(items: number): void {
    this.itemsPerPage = items
    this.currentPage = 1 // Reset to first page when changing items per page
  }

  get paginatedHistoriques(): HistoriqueRechargeDto[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage
    return this.filteredHistoriques.slice(startIndex, startIndex + this.itemsPerPage)
  }

  pageChanged(page: number): void {
    this.currentPage = page
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Méthode pour déterminer si c'est un débit (émetteur)
  isDebit(hist: HistoriqueRechargeDto): boolean {
    // Implémentez la logique pour déterminer si c'est un débit
    // Par exemple, si la carte émettrice est une des cartes du client
    return true // À adapter selon votre logique
  }

  getPages(): number[] {
    const pageCount = Math.ceil(this.totalItems / this.itemsPerPage)
    return Array.from({ length: pageCount }, (_, i) => i + 1)
  }

  // Méthode pour obtenir le nombre total de pages
  getTotalPages(): number {
    return Math.ceil(this.filteredHistoriques.length / this.itemsPerPage)
  }

  // Méthode pour obtenir les pages visibles (pour éviter trop de boutons)
  getVisiblePages(): number[] {
    const totalPages = this.getTotalPages()

    // Si moins de 5 pages, afficher toutes les pages
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    // Sinon, afficher les pages autour de la page courante
    if (this.currentPage <= 3) {
      // Près du début
      return [1, 2, 3, 4, 5]
    } else if (this.currentPage >= totalPages - 2) {
      // Près de la fin
      return Array.from({ length: 5 }, (_, i) => totalPages - 4 + i)
    } else {
      // Au milieu
      return Array.from({ length: 3 }, (_, i) => this.currentPage - 1 + i)
    }
  }
}
