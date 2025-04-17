import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { saveAs } from 'file-saver';

import { CompteService } from '../services/compte.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-rib-iban',
  templateUrl: './rib-iban.component.html',
  styleUrls: ['./rib-iban.component.scss']
})
export class RibIbanComponent implements OnInit {
  comptes: any[] = [];
  selectedCompte: string = '';
  isLoadingComptes: boolean = false;
  isDownloading: boolean = false;
  errorMessage: string = '';
  pdfUrl: SafeResourceUrl | null = null;
  showPdfViewer: boolean = false;

  constructor(
    private compteService: CompteService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadComptes();
  }

  loadComptes(): void {
    this.isLoadingComptes = true;
    this.errorMessage = '';

    this.compteService.getComptesByCin().subscribe({
      next: (data) => {
        this.comptes = data;
        this.isLoadingComptes = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des comptes', err);
        this.isLoadingComptes = false;
        this.errorMessage = 'Impossible de charger la liste des comptes';
        this.showErrorAlert();
      }
    });
  }

  downloadRIB(): void {
    if (!this.selectedCompte) return;

    this.isDownloading = true;
    this.errorMessage = '';
    this.showPdfViewer = false;

    this.compteService.downloadRIB(this.selectedCompte).subscribe({
      next: (blob: Blob) => {
        this.isDownloading = false;
        saveAs(blob, `RIB_${this.selectedCompte}.pdf`);
      },
      error: (err) => {
        this.isDownloading = false;
        console.error('Erreur lors du téléchargement', err);
        this.errorMessage = 'Erreur lors du téléchargement du RIB';
        this.showErrorAlert();
      }
    });
  }

  previewRIB(): void {
    if (!this.selectedCompte) return;

    this.isDownloading = true;
    this.errorMessage = '';

    this.compteService.downloadRIB(this.selectedCompte).subscribe({
      next: (blob: Blob) => {
        this.isDownloading = false;
        const url = URL.createObjectURL(blob);
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        this.showPdfViewer = true;
      },
      error: (err) => {
        this.isDownloading = false;
        console.error('Erreur lors du chargement', err);
        this.errorMessage = 'Erreur lors du chargement du RIB';
        this.showErrorAlert();
      }
    });
  }

  closePreview(): void {
    this.showPdfViewer = false;
    if (this.pdfUrl) {
      URL.revokeObjectURL(this.pdfUrl as string);
    }
    this.pdfUrl = null;
  }

  private showErrorAlert(): void {
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: this.errorMessage,
      confirmButtonColor: '#e74c3c',
      footer: 'Veuillez réessayer ou contacter le support'
    });
  }
}
