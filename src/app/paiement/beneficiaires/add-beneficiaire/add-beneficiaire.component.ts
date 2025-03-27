// add-beneficiaire.component.ts
import { Component, OnInit } from '@angular/core';
import { BeneficiaireService } from 'src/app/services/beneficiaire.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-beneficiaire',
  templateUrl: './add-beneficiaire.component.html',
  styleUrls: ['./add-beneficiaire.component.scss']
})
export class AddBeneficiaireComponent implements OnInit {
  beneficiaryType: string = 'PersonnePhisique'; // Correction de l'orthographe
  Nom: string = '';
  Prenom: string = '';
  RaisonSociale: string = '';
  Email: string = '';
  Telephone: string = '';
  RibCompte: string = '';

  constructor(private beneficiaireService: BeneficiaireService) {
    console.log('AddBeneficiaireComponent - Constructeur appelé');
  }

  ngOnInit(): void {
    console.log('AddBeneficiaireComponent - ngOnInit appelé');
  }

  onSubmit(): void {
    console.log('AddBeneficiaireComponent - onSubmit appelé');
    console.log('Type de bénéficiaire:', this.beneficiaryType);
    console.log('Valeurs du formulaire:', {
      Nom: this.Nom,
      Prenom: this.Prenom,
      RaisonSociale: this.RaisonSociale,
      Email: this.Email,
      Telephone: this.Telephone,
      RibCompte: this.RibCompte
    });

    // Correction de l'orthographe ici aussi
    if (this.beneficiaryType === 'PersonnePhisique' && (!this.Nom || !this.Prenom)) {
      console.error('Erreur de validation: Nom et Prénom requis pour PersonnePhisique');
      Swal.fire('Erreur', 'Veuillez remplir les champs Nom et Prénom.', 'error');
      return;
    }
    if (this.beneficiaryType === 'PersonneMorale' && !this.RaisonSociale) {
      console.error('Erreur de validation: RaisonSociale requise pour PersonneMorale');
      Swal.fire('Erreur', 'Veuillez remplir le champ Raison sociale.', 'error');
      return;
    }
    if (!this.RibCompte) {
      console.error('Erreur de validation: RIB requis');
      Swal.fire('Erreur', 'Veuillez remplir le champ RIB.', 'error');
      return;
    }

    const data = {
      Type: this.beneficiaryType,
      Nom: this.Nom,
      Prenom: this.Prenom,
      RaisonSociale: this.RaisonSociale,
      Email: this.Email,
      Telephone: this.Telephone,
      RIBCompte: this.RibCompte, // Attention à la casse, doit correspondre au DTO
    };

    console.log('Données à envoyer au service:', data);

    this.beneficiaireService.CreateBeneficiaire(data).subscribe(
      (response) => {
        console.log('Réponse du service:', response);
        Swal.fire('Succès', 'Bénéficiaire ajouté avec succès !', 'success');
        this.resetForm();
      },
      (error) => {
        console.error('Erreur lors de l\'appel au service:', error);
        console.error('Détails de l\'erreur:', {
          status: error.status,
          message: error.message,
          error: error.error
        });
        Swal.fire('Erreur', 'Une erreur est survenue lors de l\'ajout du bénéficiaire.', 'error');
      }
    );
  }

  resetForm(): void {
    console.log('Réinitialisation du formulaire');
    this.beneficiaryType = 'PersonnePhisique'; // Correction ici aussi
    this.Nom = '';
    this.Prenom = '';
    this.RaisonSociale = '';
    this.Email = '';
    this.Telephone = '';
    this.RibCompte = '';
    console.log('Formulaire réinitialisé:', {
      beneficiaryType: this.beneficiaryType,
      Nom: this.Nom,
      Prenom: this.Prenom,
      RaisonSociale: this.RaisonSociale,
      Email: this.Email,
      Telephone: this.Telephone,
      RibCompte: this.RibCompte
    });
  }
}
