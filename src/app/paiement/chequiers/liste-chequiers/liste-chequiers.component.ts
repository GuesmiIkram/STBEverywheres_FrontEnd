import { Component, OnInit } from '@angular/core';
import { ChequierService } from 'src/app/services/Chequier.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DemandeFormatee} from 'src/app/Models/DemandeFormatee';
@Component({
  selector: 'app-liste-chequiers',
  templateUrl: './liste-chequiers.component.html',
  styleUrls: ['./liste-chequiers.component.scss']
})
export class ListechequiersComponent implements OnInit{


  chequiers: any[] = [];
  selectedChequier: any = null;
  feuilles: any[] = [];
  isLoadingChequiers = true;
  isLoadingFeuilles = false;
  errorChequiers: string | null = null;
  errorFeuilles: string | null = null;
  showDetailsModal = false;

  constructor(
    private chequierService: ChequierService
  ) { }

  ngOnInit(): void {
    this.loadChequiers();
  }

  /*loadChequiers(): void {
    this.isLoadingChequiers = true;
    this.errorChequiers = null;

    this.chequierService.getChequesParClient().subscribe({
      next: (data) => {
        this.chequiers = data;
        this.isLoadingChequiers = false;
      },
      error: (err) => {
        this.errorChequiers = 'Erreur lors du chargement des chéquiers';
        this.isLoadingChequiers = false;
        console.error(err);
      }
    });
  }*/
    loadChequiers(): void {
      this.isLoadingChequiers = true;
      this.errorChequiers = null;

      this.chequierService.getChequesParClient().subscribe({
        next: (data) => {
          this.chequiers = data || [];
          this.isLoadingChequiers = false;
        },
        error: (err) => {
          if (err.status === 404 && err.error === 'Aucune demande de chéquier trouvée pour ce client.') {
            // Cas fonctionnel : aucun chéquier = on vide la liste
            this.chequiers = [];
            this.errorChequiers = null;
          } else {
            this.errorChequiers = 'Erreur lors du chargement des chéquiers';
            console.error(err);
          }
          this.isLoadingChequiers = false;
        }
      });
    }

  showFeuillesDetails(chequier: any): void {
    this.selectedChequier = chequier;
    this.isLoadingFeuilles = true;
    this.errorFeuilles = null;
    this.showDetailsModal = true;

    this.chequierService.getFeuillesParChequier(chequier.numeroChequier).subscribe({
      next: (data) => {
        this.feuilles = data;
        this.isLoadingFeuilles = false;
      },
      error: (err) => {
        this.errorFeuilles = 'Erreur lors du chargement des feuilles';
        this.isLoadingFeuilles = false;
        console.error(err);
      }
    });
  }


// liste-chequiers.component.ts
truncateText(text: string, limit: number): string {
  if (!text) return '';
  return text.length > limit ? text.substring(0, limit) + '...' : text;
}

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedChequier = null;
    this.feuilles = [];
  }
}
