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
  typeFilter = "all" // 'all', 'debit', 'credit'

  // Date filter
  dateRange = {
    start: "",
    end: "",
  }

  // Pagination
  currentPage = 1
  itemsPerPage = 10
  totalItems = 0
  Math = Math // Pour utiliser Math dans le template

  constructor(private carteService: CarteService) {}

  ngOnInit(): void {
    this.loadHistoriques()
    // Initialiser la date de fin à aujourd'hui
    const today = new Date()
    this.dateRange.end = this.formatDateForInput(today)

    // Initialiser la date de début à il y a 30 jours
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(today.getDate() - 30)
    this.dateRange.start = this.formatDateForInput(thirtyDaysAgo)
  }

  loadHistoriques(): void {
    this.isLoading = true
    this.errorMessage = null

    this.carteService.getHistorique().subscribe({
      next: (data) => {
        this.historiques = data
        this.applyFilters()
        this.isLoading = false
      },
      error: (err) => {
        console.error("Erreur:", err)
        this.errorMessage = "Erreur lors du chargement de l'historique"
        this.isLoading = false
      },
    })
  }

  // Méthode pour filtrer par type en cliquant sur les cartes
  filterByType(type: string): void {
    // Si on clique sur le même type déjà sélectionné, on revient à "all"
    if (this.typeFilter === type && type !== "all") {
      this.typeFilter = "all"
    } else {
      this.typeFilter = type
    }

    this.applyFilters()
  }

  applyFilters(): void {
    let filtered = [...this.historiques]

    // Filtre par numéro de carte
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase()
      filtered = filtered.filter(
        (h) => h.carteEmetteurNum.toLowerCase().includes(term) || h.carteRecepteurNum.toLowerCase().includes(term),
      )
    }

    // Filtre par date
    if (this.dateRange.start && this.dateRange.end) {
      const startDate = new Date(this.dateRange.start)
      startDate.setHours(0, 0, 0, 0)

      const endDate = new Date(this.dateRange.end)
      endDate.setHours(23, 59, 59, 999)

      filtered = filtered.filter((h) => {
        const transactionDate = new Date(h.dateRecharge)
        return transactionDate >= startDate && transactionDate <= endDate
      })
    }

    // Filtre par type (débit/crédit)
    if (this.typeFilter !== "all") {
      const isDebitFilter = this.typeFilter === "debit"
      filtered = filtered.filter((h) => h.isDebit === isDebitFilter)
    }

    this.filteredHistoriques = filtered
    this.currentPage = 1
    this.totalItems = this.filteredHistoriques.length
  }

  resetFilters(): void {
    // Réinitialiser le filtre de recherche
    this.searchTerm = ""

    // Réinitialiser le filtre de type
    this.typeFilter = "all"

    // Réinitialiser les dates (30 derniers jours)
    const today = new Date()
    this.dateRange.end = this.formatDateForInput(today)

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(today.getDate() - 30)
    this.dateRange.start = this.formatDateForInput(thirtyDaysAgo)

    // Appliquer les filtres réinitialisés
    this.applyFilters()
  }

  formatDateForInput(date: Date): string {
    return date.toISOString().split("T")[0]
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

  isDebit(hist: HistoriqueRechargeDto): boolean {
    return hist.isDebit
  }

  // Méthodes pour obtenir les compteurs de transactions
  getDebitCount(): number {
    return this.historiques.filter((h) => h.isDebit).length
  }

  getCreditCount(): number {
    return this.historiques.filter((h) => !h.isDebit).length
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
      return Array.from({ length: 5 }, (_, i) => this.currentPage - 2 + i)
    }
  }
}

