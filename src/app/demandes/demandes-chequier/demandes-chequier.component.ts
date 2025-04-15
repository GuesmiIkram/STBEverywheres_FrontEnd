import { Component, OnInit } from '@angular/core';
import { RepondreDemandeChequierService } from '../../services/RepondreDemandeChequier.service';
import { DemandeChequier } from 'src/app/Models/DemandeChequier';
import { DemandeChequierStatus } from "src/app/enums/DemandeChequierStatus.enum";
import { ModeLivraisonChequier } from "src/app/enums/ModeLivraisonChequier.enum";

@Component({
  selector: "app-demandes-chequier",
  templateUrl: "./demandes-chequier.component.html",
  styleUrls: ["./demandes-chequier.component.scss"],
})
export class DemandesChequierComponent implements OnInit {
  demandes: DemandeChequier[] = []
  paginatedDemandes: DemandeChequier[] = []
  isLoading = true
  errorMessage = ""
  DemandeStatus = DemandeChequierStatus
  ModeLivraison = ModeLivraisonChequier
  selectedStatuses: { [id: number]: DemandeChequierStatus | null } = {}
  ribRecherche = ""

  itemsPerPage = 5
  currentPage = 1
  totalItems = 0
  totalPages = 0

  constructor(private demandeService: RepondreDemandeChequierService) {
    console.log("Constructeur exécuté")
  }

  ngOnInit(): void {
    console.log("ngOnInit lancé")
    this.loadDemandes()
  }

  rechercherParRib(): void {
    const rib = this.ribRecherche.trim()
    console.log("Recherche par RIB lancée avec :", rib)

    if (!rib) {
      console.log("Aucun RIB fourni, rechargement de toutes les demandes")
      this.loadDemandes()
      return
    }

    this.isLoading = true
    this.selectedStatuses = {}

    this.demandeService.getDemandesParRib(rib).subscribe({
      next: (data) => {
        console.log("Demandes récupérées par RIB :", data)
        this.demandes = data
        this.totalItems = data.length
        this.calculateTotalPages()
        this.updatePaginatedDemandes()
        this.isLoading = false
      },
      error: (err) => {
        console.error("Erreur lors de la recherche par RIB :", err)
        this.errorMessage = "Erreur lors de la recherche par RIB"
        this.isLoading = false
      },
    })
  }

  reinitialiserRecherche(): void {
    console.log("Réinitialisation de la recherche")
    this.ribRecherche = ""
    this.loadDemandes()
  }

  loadDemandes(): void {
    this.isLoading = true
    console.log("Chargement des demandes de chéquiers...")

    this.demandeService.getDemandesEnAttente().subscribe({
      next: (data) => {
        console.log("Données reçues du service :", data)
        this.demandes = data
        this.totalItems = data.length
        this.calculateTotalPages()
        this.updatePaginatedDemandes()
        this.isLoading = false
      },
      error: (err) => {
        this.errorMessage = "Erreur lors du chargement des demandes"
        this.isLoading = false
        console.error("Erreur API getDemandesEnAttente:", err)
      },
    })
  }

  updateStatus(demande: DemandeChequier): void {
    const selected = this.selectedStatuses[demande.idDemande]
    console.log(`Tentative de mise à jour du statut pour la demande #${demande.idDemande}, statut sélectionné :`, selected)

    if (selected == null) {
      console.log("Aucun statut sélectionné, annulation de la mise à jour")
      return
    }

    const selectedStatusString = DemandeChequierStatus[selected]
    console.log("Statut converti en string :", selectedStatusString)

    this.demandeService.changerStatutDemande(demande.idDemande, selectedStatusString).subscribe({
      next: () => {
        console.log(`Statut mis à jour avec succès pour la demande #${demande.idDemande}`)
        demande.status = selected
        this.selectedStatuses[demande.idDemande] = null
      },
      error: (err) => {
        console.error(`Erreur lors de la mise à jour du statut de la demande #${demande.idDemande}:`, err)
        alert("Échec de la mise à jour")
      },
    })
  }
/*
  getOptionsStatut(demande: DemandeChequier): DemandeChequierStatus[] {
    console.log("Récupération des options de statut pour la demande :", demande)

    const options: DemandeChequierStatus[] = []

    if (demande.modeLivraison === ModeLivraisonChequier.LivraisonAgence) {
      console.log("Mode de livraison : Livraison en agence")
      if (demande.status === DemandeChequierStatus.EnCoursPreparation) {
        options.push(DemandeChequierStatus.DisponibleEnAgence)
      }
      if (demande.status === DemandeChequierStatus.DisponibleEnAgence) {
        options.push(DemandeChequierStatus.RemisAuClient)
      }
    } else if (demande.modeLivraison === ModeLivraisonChequier.EnvoiRecommande) {
      console.log("Mode de livraison : Envoi recommandé")
      if (demande.status === DemandeChequierStatus.EnCoursPreparation) {
        options.push(DemandeChequierStatus.Expedie)
      }
    }

    console.log("Options retournées :", options)
    return options
  }*/
    getOptionsStatut(demande: DemandeChequier): DemandeChequierStatus[] {
      const options: DemandeChequierStatus[] = [];

      // Convertir modeLivraison si nécessaire
      const modeLivraison = typeof demande.modeLivraison === 'number'
        ? this.numberToModeLivraison(demande.modeLivraison)
        : demande.modeLivraison;

      // Convertir status si nécessaire
      const status = typeof demande.status === 'number'
        ? this.numberToDemandeStatus(demande.status)
        : demande.status;

      if (modeLivraison === ModeLivraisonChequier.LivraisonAgence) {
        if (status === DemandeChequierStatus.EnCoursPreparation) {
          options.push(DemandeChequierStatus.DisponibleEnAgence);
        }
        if (status === DemandeChequierStatus.DisponibleEnAgence) {
          options.push(DemandeChequierStatus.RemisAuClient);
        }
      } else if (modeLivraison === ModeLivraisonChequier.EnvoiRecommande) {
        if (status === DemandeChequierStatus.EnCoursPreparation) {
          options.push(DemandeChequierStatus.Expedie);
        }
      }

      return options;
    }

  getStatusLabel(status: DemandeChequierStatus): string {
    return this.getStatusOptionLabel(status)
  }
/*
  getStatusOptionLabel(status: DemandeChequierStatus): string {
    const label = (() => {
      switch (status) {
        case DemandeChequierStatus.EnCoursPreparation:
          return "En cours de préparation"
        case DemandeChequierStatus.DisponibleEnAgence:
          return "Disponible en agence"
        case DemandeChequierStatus.RemisAuClient:
          return "Remis au client"
        case DemandeChequierStatus.Expedie:
          return "Expédié"
        default:
          return String(status)
      }
    })()

    console.log(`Label du statut [${status}] = ${label}`)
    return label
  }*/
    getStatusOptionLabel(status: DemandeChequierStatus | number): string {
      // Convertir si c'est un nombre
      const statusValue = typeof status === 'number' ? this.numberToDemandeStatus(status) : status;

      switch (statusValue) {
        case DemandeChequierStatus.EnCoursPreparation:
          return "En cours de préparation";
        case DemandeChequierStatus.DisponibleEnAgence:
          return "Disponible en agence";
        case DemandeChequierStatus.RemisAuClient:
          return "Remis au client";
        case DemandeChequierStatus.Expedie:
          return "Expédié";
        default:
          return "Statut inconnu";
      }
    }
/*
  getModeLivraisonLabel(mode: ModeLivraisonChequier): string {
    const label = (() => {
      switch (mode) {
        case ModeLivraisonChequier.LivraisonAgence:
          return "Livraison en agence"
        case ModeLivraisonChequier.EnvoiRecommande:
          return "Envoi recommandé"
        default:
          return String(mode)
      }
    })()

    console.log(`Label du mode de livraison [${mode}] = ${label}`)
    return label
  }*/
    getModeLivraisonLabel(mode: ModeLivraisonChequier | number): string {
      // Convertir si c'est un nombre
      const modeValue = typeof mode === 'number' ? this.numberToModeLivraison(mode) : mode;

      switch (modeValue) {
        case ModeLivraisonChequier.LivraisonAgence:
          return "Livraison en agence";
        case ModeLivraisonChequier.EnvoiRecommande:
          return "Envoi recommandé";
        default:
          return "Mode inconnu";
      }
    }
    // Fonction pour convertir un nombre en ModeLivraisonChequier
private numberToModeLivraison(mode: number): ModeLivraisonChequier {
  return mode === 0 ? ModeLivraisonChequier.LivraisonAgence : ModeLivraisonChequier.EnvoiRecommande;
}

// Fonction pour convertir un nombre en DemandeChequierStatus
private numberToDemandeStatus(status: number): DemandeChequierStatus {
  const statusMap = [
    DemandeChequierStatus.EnCoursPreparation,
    DemandeChequierStatus.DisponibleEnAgence,
    DemandeChequierStatus.RemisAuClient,
    DemandeChequierStatus.Expedie
  ];
  return statusMap[status] || DemandeChequierStatus.EnCoursPreparation;
}

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage)
    console.log(`Total items : ${this.totalItems}, Total pages calculées : ${this.totalPages}`)

    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages > 0 ? this.totalPages : 1
      console.log(`Page courante ajustée : ${this.currentPage}`)
    }
  }

  updatePaginatedDemandes(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.totalItems)
    this.paginatedDemandes = this.demandes.slice(startIndex, endIndex)
    console.log(`Pagination mise à jour : page ${this.currentPage}, items ${startIndex} à ${endIndex}`)
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) {
      console.log("Changement de page annulé : page invalide ou déjà active")
      return
    }

    console.log(`Passage à la page ${page}`)
    this.currentPage = page
    this.updatePaginatedDemandes()
  }

  getPaginationRange(): number[] {
    const range: number[] = []
    const maxVisiblePages = 5

    if (this.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= this.totalPages; i++) {
        range.push(i)
      }
    } else {
      let start = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2))
      let end = start + maxVisiblePages - 1

      if (end > this.totalPages) {
        end = this.totalPages
        start = Math.max(1, end - maxVisiblePages + 1)
      }

      for (let i = start; i <= end; i++) {
        range.push(i)
      }
    }

    console.log("Plage de pagination générée :", range)
    return range
  }
}
