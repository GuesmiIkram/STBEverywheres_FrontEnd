import { Component, OnInit } from "@angular/core";
import { RepondreDemandeDecouvertService } from "../../services/RepondreDemandeDecouvert.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";

@Component({
  selector: "app-demande-decouvert",
  templateUrl: "./demande-decouvert.component.html",
  styleUrls: ["./demande-decouvert.component.scss"],
})
export class DemandeDecouvertComponent implements OnInit {
  responseForm: FormGroup;
  demands: any[] = [];
  filteredDemands: any[] = [];
  pagedDemands: any[] = [];

  selectedDemandId: string = "";
  isLoading = false;
  isSubmitting = false;
  errorMessage = "";
  searchTerm = "";
  selectedDemandDetails: any;

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  Math = Math;

  constructor(
    private fb: FormBuilder,
    private demandeService: RepondreDemandeDecouvertService,
    private modalService: NgbModal
  ) {
    this.responseForm = this.fb.group({
      accepte: [null, Validators.required],
      motifRefus: [""],
    });

    this.responseForm.get("accepte")?.valueChanges.subscribe((accepte) => {
      const motifRefusControl = this.responseForm.get("motifRefus");
      if (accepte === false) {
        motifRefusControl?.setValidators([Validators.required]);
      } else {
        motifRefusControl?.clearValidators();
        motifRefusControl?.setValue("");
      }
      motifRefusControl?.updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    this.loadPendingDemands();
  }
  loadPendingDemands(): void {
    this.isLoading = true;
    this.errorMessage = "";

    this.demandeService.getPendingDemands().subscribe({
      next: (data) => {
        if (data.length === 0) {
          // Cas normal où il n'y a aucune demande
          this.demands = [];
          this.filteredDemands = [];
          this.pagedDemands = [];
          this.totalPages = 1;
          this.currentPage = 1;
        } else {
          // Cas où il y a des demandes
          this.demands = data.map((d) => ({
            id: d.id,
            dateDemande: d.dateDemande,
            ribCompte: d.ribCompte,
            decouvertactuel: d.compte.decouvertAutorise,
            numCin: d.compte?.numCin || "N/A",
            montant: d.decouvertDemande,
          }));

          this.filterDemands();
        }
        this.isLoading = false;
      },
      error: (err) => {
        // On vérifie si c'est une 404 (aucune demande trouvée)
        if (err.status === 404 && err.error?.message === 'Aucune demande trouvée pour cette agence.') {
          // Cas normal où il n'y a aucune demande
          this.demands = [];
          this.filteredDemands = [];
          this.pagedDemands = [];
          this.totalPages = 1;
          this.currentPage = 1;
        } else {
          // Cas d'une vraie erreur
          //this.showErrorAlert("Échec du chargement des demandes. Veuillez réessayer.");
          this.demands = [];
          this.filteredDemands = [];
          this.pagedDemands = [];
          this.totalPages = 1;
          this.currentPage = 1;
        }
        this.isLoading = false;
      },
    });
  }
  /*loadPendingDemands(): void {
    this.isLoading = true;
    this.errorMessage = "";

    this.demandeService.getPendingDemands().subscribe({
      next: (data) => {
        this.demands = data.map((d) => ({
          id: d.id,
          dateDemande: d.dateDemande,
          ribCompte: d.ribCompte,
          decouvertactuel: d.compte.decouvertAutorise,
          numCin: d.compte?.numCin || "N/A",
          montant: d.decouvertDemande,
        }));

        this.filterDemands();
        this.isLoading = false;
      },
      error: (err) => {
        this.showErrorAlert("Échec du chargement des demandes. Veuillez réessayer.");
        this.isLoading = false;
        console.error(err);
      },
    });
  }*/

  filterDemands(): void {
    if (!this.searchTerm) {
      this.filteredDemands = [...this.demands];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredDemands = this.demands.filter(
        (demand) =>
          demand.ribCompte.toLowerCase().includes(term) ||
          demand.numCin.toLowerCase().includes(term)
      );
    }

    this.totalPages = Math.ceil(this.filteredDemands.length / this.pageSize);
    this.currentPage = 1;
    this.updatePagedDemands();
  }

  updatePagedDemands(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.filteredDemands.length);
    this.pagedDemands = this.filteredDemands.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    this.updatePagedDemands();
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;

    if (this.totalPages <= maxPagesToShow) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, this.currentPage - 2);
      const endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

      if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  }

  selectDemand(demandId: string, content: any): void {
    this.selectedDemandId = demandId;
    this.selectedDemandDetails = this.filteredDemands.find(d => d.id === demandId);
    this.responseForm.reset();

    this.modalService.open(content, {
      size: 'lg',
      centered: true,
      backdrop: 'static'
    });
  }

  submitResponse(): void {
    // Vérifiez que l'ID n'est pas vide plutôt que null
    if (!this.selectedDemandId || this.selectedDemandId === "" || this.responseForm.invalid) {
      this.responseForm.markAllAsTouched();
      return;
    }

    const decision = this.responseForm.value.accepte ? 'accepter' : 'refuser';
    const title = this.responseForm.value.accepte
      ? 'Confirmer l\'acceptation'
      : 'Confirmer le refus';
    const text = this.responseForm.value.accepte
      ? 'Êtes-vous sûr de vouloir accepter cette demande de découvert?'
      : 'Êtes-vous sûr de vouloir refuser cette demande de découvert?';

    Swal.fire({
      title: title,
      text: text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, confirmer',
      cancelButtonText: 'Non, annuler',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.processResponse();
      }
    });
  }

  private processResponse(): void {
    this.isSubmitting = true;
    // Créez l'objet response avec l'interface correcte
    const response: { idDemande: string; accepte: boolean; motifRefus?: string } = {
      idDemande: this.selectedDemandId, // Maintenant garanti d'être un string
      accepte: this.responseForm.value.accepte,
      motifRefus: this.responseForm.value.motifRefus || undefined // Utilisez undefined au lieu de null
    };

    this.demandeService.respondToDemand(response).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.modalService.dismissAll();
        this.showSuccessAlert(
          this.responseForm.value.accepte
            ? 'Demande acceptée avec succès'
            : 'Demande refusée avec succès'
        );
        this.loadPendingDemands();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.showErrorAlert("Échec de l'envoi de la réponse. Veuillez réessayer.");
        console.error(err);
      }
    });
  }

  private showSuccessAlert(message: string): void {
    Swal.fire({
      title: 'Succès!',
      text: message,
      icon: 'success',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
      timer: 3000,
      timerProgressBar: true
    });
  }

  private showErrorAlert(message: string): void {
    Swal.fire({
      title: 'Erreur!',
      text: message,
      icon: 'error',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK'
    });}



//pour afficher decouvet actuel et decouvert demandé avec uen forme correcte
    getNombreFormate(nombre: number): string {
      return new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3
      }).format(nombre)+' TND';
    }

  }
