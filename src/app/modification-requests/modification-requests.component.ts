import { Component, type OnInit } from "@angular/core"
import { saveAs } from "file-saver"

import type { ModificationRequest } from "../Models/ModificationRequest"

import Swal from "sweetalert2"
import { AgentService } from "../services/AgentService "
import { HttpResponse } from "@angular/common/http"

@Component({
  selector: "app-modification-requests",
  templateUrl: "./modification-requests.component.html",
  styleUrls: ["./modification-requests.component.scss"],
})
export class ModificationRequestsComponent implements OnInit {
  requests: ModificationRequest[] = []
  selectedRequest: ModificationRequest | null = null
  processing = false
  refusalComment = ""
  showRefusalInput = false

  constructor(private agentService: AgentService) {}

  ngOnInit(): void {
    this.loadRequests()
  }

  loadRequests(): void {
    this.processing = true
    this.agentService.getPendingModificationRequests().subscribe({
      next: (requests) => {
        console.log("dm rtournee de back",requests)
        this.requests = requests
        this.processing = false
      },
      error: (err) => {
        console.error("Error loading requests:", err)
        this.showError("Erreur lors du chargement des demandes")
        this.processing = false
      },
    })
  }

  selectRequest(request: ModificationRequest): void {
    this.selectedRequest = request
    this.refusalComment = ""
    this.showRefusalInput = false
  }

  downloadDocument(request: ModificationRequest): void {
    this.processing = true;
    this.agentService.downloadJustificationDocument(request.id).subscribe({
      next: (response: HttpResponse<Blob>) => {
        const blob = response.body;
        if (!blob) {
          throw new Error('No document found');
        }

        // Déterminer le type de fichier
        const contentType = response.headers.get('content-type') || 'application/octet-stream';
        let extension = '.bin';

        if (contentType.includes('png')) extension = '.png';
        else if (contentType.includes('jpeg') || contentType.includes('jpg')) extension = '.jpg';
        else if (contentType.includes('pdf')) extension = '.pdf';

        const filename = `Justificatif_${request.client?.nom}_${request.fieldToModify}${extension}`;
        saveAs(blob, filename);
        this.processing = false;
      },
      error: (err) => {
        console.error("Error downloading document:", err);
        this.showError("Erreur lors du téléchargement du document");
        this.processing = false;
      }
    });
  }
  getFieldDisplayName(field: string): string {
    const fieldMap: { [key: string]: string } = {
      adresse: "Adresse",
      profession: "Profession",
      situationprofessionnelle: "Situation Professionnelle",
      etatcivil: "État Civil",
      residence: "Résidence",
    }
    return fieldMap[field.toLowerCase()] || field
  }

  confirmApproveRequest(request: ModificationRequest): void {
    Swal.fire({
      title: "Confirmation",
      text: `Êtes-vous sûr de vouloir accepter la modification de ${this.getFieldDisplayName(request.fieldToModify)} pour ${request.client?.nom} ${request.client?.prenom}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Oui, accepter",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        this.approveRequest(request)
      }
    })
  }

  showRefusalDialog(request: ModificationRequest): void {
    Swal.fire({
      title: "Motif de refus",
      input: "text",
      inputLabel: "Veuillez saisir un motif de refus",
      inputPlaceholder: "Motif de refus",
      showCancelButton: true,
      confirmButtonText: "Refuser",
      cancelButtonText: "Annuler",
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      inputValidator: (value) => {
        if (!value) {
          return "Vous devez saisir un motif de refus"
        }
        return null
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.refusalComment = result.value
        this.refuseRequest(request)
      }
    })
  }

  approveRequest(request: ModificationRequest): void {
    this.processing = true
    this.agentService.processModificationRequest(request.id, true).subscribe({
      next: () => {
        this.showSuccess("Demande acceptée avec succès")
        this.loadRequests()
        this.selectedRequest = null
      },
      error: (err) => {
        console.error("Error approving request:", err)
        this.showError("Erreur lors de l'acceptation de la demande")
        this.processing = false
      },
    })
  }

  refuseRequest(request: ModificationRequest): void {
    if (!this.refusalComment) {
      this.showWarning("Veuillez saisir un motif de refus")
      return
    }

    this.processing = true
    this.agentService.processModificationRequest(request.id, false, this.refusalComment).subscribe({
      next: () => {
        this.showSuccess("Demande refusée avec succès")
        this.loadRequests()
        this.selectedRequest = null
      },
      error: (err) => {
        console.error("Error refusing request:", err)
        this.showError("Erreur lors du refus de la demande")
        this.processing = false
      },
    })
  }

  // Méthodes d'alerte personnalisées
  private showSuccess(message: string): void {
    Swal.fire({
      title: "Succès",
      text: message,
      icon: "success",
      confirmButtonText: "OK",
      timer: 3000,
    })
  }

  private showError(message: string): void {
    Swal.fire({
      title: "Erreur",
      text: message,
      icon: "error",
      confirmButtonText: "OK",
    })
  }

  private showWarning(message: string): void {
    Swal.fire({
      title: "Attention",
      text: message,
      icon: "warning",
      confirmButtonText: "OK",
    })
  }
}
