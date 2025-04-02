import { Component } from '@angular/core';
import { ClientService } from '../services/client.service';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pack-student',
  templateUrl: './pack-student.component.html',
  styleUrls: ['./pack-student.component.scss']
})
export class PackStudentComponent {
  selectedFiles: (File | null)[] = Array(5).fill(null);
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

    // Vérification des documents obligatoires
    for (let i = 0; i < 4; i++) {
      if (!this.selectedFiles[i]) {
        await Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: `Veuillez joindre le document obligatoire ${i + 1}`,
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

    this.clientService.uploadStudentDocuments(formData).subscribe({
      next: async (response) => {
        await Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: response.message || 'Documents envoyés avec succès!',
          confirmButtonColor: '#3085d6',
        });
        form.resetForm();
        this.selectedFiles = Array(5).fill(null);
        this.selectedAgency = '';
        this.isSubmitting = false;
      },
      error: async (err) => {
        console.error('Erreur lors de l\'envoi', err);
        
        // Handle different error response formats
        const errorMessage = err.error?.message || 
                            err.error || 
                            err.message || 
                            'Erreur lors de l\'envoi des documents';
    
        // Check for the specific duplicate request message
        if (errorMessage.includes("Vous avez déjà une demande en cours")) {
          await Swal.fire({
            icon: 'warning',
            title: 'Demande existante',
            text: errorMessage,
            confirmButtonColor: '#3085d6',
          });
        } else {
          // For other errors
          await Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: errorMessage,
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