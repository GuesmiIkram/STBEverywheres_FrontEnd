import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReclamationService } from '../services/ReclamationService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reclamation',
  templateUrl: './reclamation.component.html',
  styleUrls: ['./reclamation.component.scss']
})
export class ReclamationComponent implements OnInit {
  reclamationForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private reclamationService: ReclamationService
  ) {
    this.reclamationForm = this.fb.group({
      objet: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.reclamationForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Formulaire incomplet',
        text: 'Veuillez remplir tous les champs obligatoires',
        confirmButtonColor: '#3498db'
      });
      return;
    }

    this.isLoading = true;

    this.reclamationService.createReclamation(this.reclamationForm.value).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.reclamationForm.reset();
        
        Swal.fire({
          icon: 'success',
          title: 'Succès!',
          html: `
            <p>Votre réclamation a été enregistrée avec succès</p>
           
          `,
          confirmButtonColor: '#3498db',
          showConfirmButton: true,
          timer: 5000
        });
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Erreur:', err);
        
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Une erreur est survenue lors de l\'envoi de votre réclamation',
          confirmButtonColor: '#e74c3c',
          footer: 'Veuillez réessayer ou contacter le support'
        });
      }
    });
  }
}