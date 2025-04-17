import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { ClientService } from '../services/client.service';

@Component({
  selector: 'app-pack-elyssa',
  templateUrl: './pack-elyssa.component.html',
  styleUrls: ['./pack-elyssa.component.scss']
})
export class PackElyssaComponent {
  
  selectedFiles: (File | null)[] = Array(6).fill(null); // Changé de 5 à 6 pour le nouveau document
  selectedAgency: string = '';
  isSubmitting: boolean = false;

  constructor(private clientService: ClientService) {}

  onFileSelected(event: any, index: number): void {
    const file = event.target.files[0];
    this.selectedFiles[index] = file || null;
  }

  async submitDocuments(form: NgForm): Promise<void> {
    if (this.isSubmitting) return;
    
    this.isSubmitting = true;

    // Vérification des champs obligatoires
    if (!this.selectedAgency) {
      await Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Veuillez sélectionner une agence',
        confirmButtonColor: '#3085d6',
      });
      this.isSubmitting = false;
      return;
    }

    // Vérification des documents obligatoires (indices 0, 3, 4, 5 selon le nouveau formulaire)
    const requiredDocuments = [0, 3, 4, 5]; // Passeport, Justificatif domicile France, CDI, Certificat impôt
    for (const index of requiredDocuments) {
      if (!this.selectedFiles[index]) {
        await Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: `Veuillez joindre le document obligatoire ${index + 1}`,
          confirmButtonColor: '#3085d6',
        });
        this.isSubmitting = false;
        return;
      }
    }

    const formData = new FormData();
    
    // Ajout des fichiers
    this.selectedFiles.forEach((file, index) => {
      if (file) {
        formData.append(`document${index + 1}`, file, file.name);
      }
    });

    // Ajout de l'agence
    formData.append('agency', this.selectedAgency);

    // Envoi au backend
    this.clientService.uploadElyssaDocuments(formData).subscribe({
      next: async (response) => {
        await Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: response.message || 'Documents envoyés avec succès!',
          confirmButtonColor: '#3085d6',
        });
        form.resetForm();
        this.selectedFiles = Array(6).fill(null); 
        this.selectedAgency = '';
        this.isSubmitting = false;
      },
      error: async (err) => {
        console.error('Erreur lors de l\'envoi', err);
        
        if (err.error === "Vous avez déjà une demande en cours. Vous ne pouvez pas soumettre une nouvelle demande tant que la précédente n'est pas traitée.") {
          await Swal.fire({
            icon: 'warning',
            title: 'Demande existante',
            text: err.error,
            confirmButtonColor: '#3085d6',
          });
        } else {
          await Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: err.error?.message || err.error || 'Erreur lors de l\'envoi des documents',
            confirmButtonColor: '#3085d6',
          });
        }
        
        this.isSubmitting = false;
      }
    });
  }

  triggerFileInput(id: string): void {
    const element = document.getElementById(id) as HTMLInputElement;
    if (element) element.click();
  }
}