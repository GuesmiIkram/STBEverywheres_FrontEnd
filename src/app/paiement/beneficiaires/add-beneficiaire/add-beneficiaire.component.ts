import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { BeneficiaireService } from 'src/app/services/beneficiaire.service';
import { Beneficiaire } from 'src/app/Models/Beneficiaire';
import Swal from 'sweetalert2';
//import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-beneficiaire',
  templateUrl: './add-beneficiaire.component.html',
  styleUrls: ['./add-beneficiaire.component.scss']
})
export class AddBeneficiaireComponent implements OnInit {
  // Remplacement de l'objet beneficiaire par un FormGroup
  beneficiaireForm = new FormGroup({
    nom: new FormControl('', [Validators.required, Validators.minLength(2)]),
    prenom: new FormControl('', [Validators.required, Validators.minLength(2)]),
    ribCompte: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[0-9]{20}$/) // Validation pour 20 chiffres
    ]),
    Email: new FormControl(null, [
      Validators.email // Validation optionnelle pour email
    ]),
    Telephone: new FormControl(null, [
      Validators.pattern(/^[0-9]{8,15}$/) // Validation optionnelle pour téléphone
    ])
  });

  constructor(private beneficiaireService: BeneficiaireService) {}

  ngOnInit(): void {}

  onSubmit(): void {
    // Marquer tous les champs comme touchés pour afficher les erreurs
    this.markFormGroupTouched(this.beneficiaireForm);

    if (this.beneficiaireForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Formulaire incomplet',
        text: 'Veuillez remplir correctement tous les champs obligatoires.',
        confirmButtonText: 'OK'
      });
      return;
    }

    // Préparation des données avec le bon format
    const formValue = this.beneficiaireForm.value;
    const beneficiaireData: Beneficiaire = {
      nom: formValue.nom!,
      prenom: formValue.prenom!,
      ribCompte: formValue.ribCompte!,
      email: formValue.Email || null,
      telephone: formValue.Telephone || null,
      client: null
    };

    this.beneficiaireService.createBeneficiaire(beneficiaireData).subscribe({
      next: (response) => {
        Swal.fire({
          title: 'Succès',
          text: 'Bénéficiaire ajouté avec succès !',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        this.resetForm();
      },
      error: (error) => {
        let errorMessage = 'Une erreur est survenue lors de l\'ajout du bénéficiaire.';
        if (error.error?.errors) {
          errorMessage = Object.values(error.error.errors).join('\n');
        } else if (error.error?.title) {
          errorMessage = error.error.title;
        }
        Swal.fire('Erreur', errorMessage, 'error');
      }
    });
  }

  resetForm(): void {
    this.beneficiaireForm.reset({
      nom: '',
      prenom: '',
      ribCompte: '',
      Email: null,
      Telephone: null
    });
  }

  // Méthode pour marquer tous les champs comme touchés
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Getters pratiques pour accéder aux contrôles du formulaire
  get nom() { return this.beneficiaireForm.get('nom'); }
  get prenom() { return this.beneficiaireForm.get('prenom'); }
  get ribCompte() { return this.beneficiaireForm.get('ribCompte'); }
  get Email() { return this.beneficiaireForm.get('Email'); }
  get Telephone() { return this.beneficiaireForm.get('Telephone'); }
}
