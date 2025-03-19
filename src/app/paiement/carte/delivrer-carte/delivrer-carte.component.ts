import { Component, OnInit } from '@angular/core';
import { NomCarte } from 'src/app/enums/nom-carte.enum';
import { TypeCarte } from 'src/app/enums/type-carte.enum';
import { DemandeCarte } from 'src/app/Models/DemandeCarte';
import Swal from 'sweetalert2';
import { CarteService } from 'src/app/services/carte.service';

@Component({
  selector: 'app-delivrer-carte',
  templateUrl: './delivrer-carte.component.html',
  styleUrls: ['./delivrer-carte.component.scss']
})
export class DelivrerCarteComponent implements OnInit {
  demandeCarteDTO: DemandeCarte = {
    numCompte: '',
    nomCarte: NomCarte.VisaClassic,
    typeCarte: TypeCarte.National,
    cin: '',
    email: '',
    numTel: ''
  };

  // Options pour les sélecteurs
  nomCarteOptions: string[] = [];
  typeCarteOptions = Object.values(TypeCarte);
  isPostpayee: boolean = true; // Par défaut, postpayée est sélectionnée

  constructor(private carteService: CarteService) {}

  ngOnInit(): void {
    this.updateNomCarteOptions();
  }

  onTypeCarteChange(): void {
    this.updateNomCarteOptions();
    if (!this.isPostpayee) {
      this.demandeCarteDTO.numCompte = ''; // Réinitialiser le numéro de compte si prépayée est sélectionnée
    }
  }

  updateNomCarteOptions(): void {
    if (this.isPostpayee) {
      this.nomCarteOptions = Object.values(NomCarte).filter(nom => nom !== NomCarte.CarteCIB);
    } else {
      this.nomCarteOptions = [NomCarte.CarteCIB];
    }
  }

  onSubmit(): void {
    if (this.isPostpayee) {
      this.carteService.createDemandeCarte(this.demandeCarteDTO)
        .subscribe({
          next: (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Succès',
              text: 'Demande de carte postpayée créée avec succès.',
            });
          },
          error: (err) => {
            // Extraire le message d'erreur du backend (pour une réponse structurée)
            const errorMessage = err.error?.message || err.error || 'Une erreur est survenue lors de la demande de carte.';
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: errorMessage, // Afficher le message d'erreur
            });
          }
        });
    } else {
      this.carteService.createDemandeCartePrepayee(this.demandeCarteDTO)
        .subscribe({
          next: (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Succès',
              text: 'Demande de carte prépayée créée avec succès.',
            });
          },
          error: (err) => {
            // Extraire le message d'erreur du backend (pour une réponse structurée)
            const errorMessage = err.error?.message || err.error || 'Une erreur est survenue lors de la demande de carte prépayée.';
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: errorMessage, // Afficher le message d'erreur
            });
          }
        });
    }
  } }
