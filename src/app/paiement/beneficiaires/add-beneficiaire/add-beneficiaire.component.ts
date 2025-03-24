import { Component, OnInit } from '@angular/core';
import { BeneficiaireService } from 'src/app/services/beneficiaire.service'; // Importez le service
import Swal from 'sweetalert2'; // Importez SweetAlert2

@Component({
  selector: 'app-add-beneficiaire',
  templateUrl: './add-beneficiaire.component.html',
  styleUrls: ['./add-beneficiaire.component.scss']
})
export class AddBeneficiaireComponent implements OnInit {
  /*beneficiaryType: string = 'PersonnePhisique'; // Type de bénéficiaire par défaut
  Nom: string = '';
  Prenom: string = '';
  RaisonSociale: string = '';
  Email: string = '';
  Telephone: string = '';
  RibCompte: string = '';*/

  constructor(private beneficiaireService: BeneficiaireService) { } // Injectez le service

  ngOnInit(): void {
  }

  /*onSubmit(): void {
    // Validation des champs obligatoires
    if (this.beneficiaryType === 'PersonnePhysique' && (!this.Nom || !this.Prenom)) {
      Swal.fire('Erreur', 'Veuillez remplir les champs Nom et Prénom.', 'error'); // SweetAlert2 pour l'erreur
      return;
    }
    if (this.beneficiaryType === 'PersonneMorale' && !this.RaisonSociale) {
      Swal.fire('Erreur', 'Veuillez remplir le champ Raison sociale.', 'error'); // SweetAlert2 pour l'erreur
      return;
    }
    if (!this.RibCompte) {
      Swal.fire('Erreur', 'Veuillez remplir le champ RIB.', 'error'); // SweetAlert2 pour l'erreur
      return;
    }

    // Préparer les données à envoyer
    const data = {
      Type: this.beneficiaryType,
      Nom: this.Nom,
      Prenom: this.Prenom,
      RaisonSociale: this.RaisonSociale,
      Email: this.Email,
      Telephone: this.Telephone,
      RibCompte: this.RibCompte,
    };
    console.log('donnee',data);
    // Envoyer les données au serveur
    this.beneficiaireService.CreateBeneficiaire(data).subscribe(
      (response) => {
        // Succès : afficher une alerte SweetAlert2
        Swal.fire('Succès', 'Bénéficiaire ajouté avec succès !', 'success');
        // Réinitialiser le formulaire après succès
        this.resetForm();
      },
      (error) => {
        // Erreur : afficher une alerte SweetAlert2
        Swal.fire('Erreur', 'Une erreur est survenue lors de l\'ajout du bénéficiaire.', 'error');
      }
    );
  }

  // Méthode pour réinitialiser le formulaire
  resetForm(): void {
    this.beneficiaryType = 'personne-physique';
    this.Nom = '';
    this.Prenom = '';
    this.RaisonSociale = '';
    this.Email = '';
    this.Telephone = '';
    this.RibCompte = '';
  }*/
}
