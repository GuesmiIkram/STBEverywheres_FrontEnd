import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { saveAs } from 'file-saver';
import { ClientService } from '../services/client.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-kyc-download',
  templateUrl: './kyc-download.component.html',
  styleUrls: ['./kyc-download.component.scss']
})
export class KycDownloadComponent {
  isDownloading: boolean = false;
  errorMessage: string = '';
  pdfUrl: SafeResourceUrl | null = null;
  showPdfViewer: boolean = false;
  client: any; // Vous devriez initialiser cette propriété avec les données du client

  constructor(
    private clientService: ClientService,
    private sanitizer: DomSanitizer
  ) {}

  downloadKYC(): void {
    this.isDownloading = true;
    this.errorMessage = '';
    this.showPdfViewer = false;

    this.clientService.downloadKYC().subscribe({
      next: (blob: Blob) => {
        this.isDownloading = false;
        let filename = 'Fiche_KYC.pdf';
        
        if (this.client) {
          filename = `Fiche_KYC_${this.client.nom}_${this.client.prenom}.pdf`;
        }
        
        saveAs(blob, filename);
      },
      error: (err) => {
        this.isDownloading = false;
        console.error('Erreur lors du téléchargement', err);
        this.errorMessage = 'Erreur lors du téléchargement de la fiche KYC';
        this.showErrorAlert();
      }
    });
  }

  previewKYC(): void {
    this.isDownloading = true;
    this.errorMessage = '';

    this.clientService.downloadKYC().subscribe({
      next: (blob: Blob) => {
        this.isDownloading = false;
        const url = URL.createObjectURL(blob);
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        this.showPdfViewer = true;
      },
      error: (err) => {
        this.isDownloading = false;
        console.error('Erreur lors du chargement', err);
        this.errorMessage = 'Erreur lors du chargement de la fiche KYC';
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