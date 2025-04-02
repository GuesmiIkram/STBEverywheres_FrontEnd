import { Component, OnInit } from '@angular/core';
import { BeneficiaireService } from 'src/app/services/beneficiaire.service';
import { Beneficiaire } from 'src/app/Models/Beneficiaire';
import Swal from 'sweetalert2';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-beneficiaire',
  templateUrl: './add-beneficiaire.component.html',
  styleUrls: ['./add-beneficiaire.component.scss']
})
export class AddBeneficiaireComponent implements OnInit {
  beneficiaire: Partial<Beneficiaire> = {
    nom: '',
    prenom: '',
    ribCompte: '',
    Email: null,
    Telephone: null,
    client: null
  };

  constructor(private beneficiaireService: BeneficiaireService,public activeModal: NgbActiveModal) {}

  ngOnInit(): void {}

  onSubmit(): void {
    // Validation des champs obligatoires
    if (!this.beneficiaire.nom || !this.beneficiaire.prenom || !this.beneficiaire.ribCompte) {
      Swal.fire('Erreur', 'Veuillez remplir tous les champs obligatoires.', 'error');
      return;
    }

    // Préparation des données avec le bon format
    const beneficiaireData: Beneficiaire = {
      nom: this.beneficiaire.nom!,
      prenom: this.beneficiaire.prenom!,
      ribCompte: this.beneficiaire.ribCompte!,
      Email: this.beneficiaire.Email || null,
      Telephone: this.beneficiaire.Telephone || null,
      client: null
    };

    this.beneficiaireService.createBeneficiaire(beneficiaireData).subscribe(
      (response) => {
        Swal.fire('Succès', 'Bénéficiaire ajouté avec succès !', 'success');
        this.resetForm();
        this.activeModal.close('success');
      },
      (error) => {
        let errorMessage = 'Une erreur est survenue lors de l\'ajout du bénéficiaire.';
        if (error.error?.errors) {
          errorMessage = Object.values(error.error.errors).join('\n');
        } else if (error.error?.title) {
          errorMessage = error.error.title;
        }
        Swal.fire('Erreur', errorMessage, 'error');
      }
    );
  }

  resetForm(): void {
    this.beneficiaire = {
      nom: '',
      prenom: '',
      ribCompte: '',
      Email: null,
      Telephone: null,
      client: null
    };
  }
}
