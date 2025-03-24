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
    NumCompte: '',
    NomCarte: NomCarte.VisaClassic,
    TypeCarte: TypeCarte.National,
    CIN:'',
    Email:'',
    NumTel:'',

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
      this.demandeCarteDTO.NumCompte = ''; // Réinitialiser le numéro de compte si prépayée est sélectionnée
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
    console.log('onSubmit() déclenché');
    console.log('Valeur de this.isPostpayee:', this.isPostpayee);
    console.log('Données envoyées:', this.demandeCarteDTO);

    if (this.isPostpayee) {
        console.log('Envoi de la demande de carte postpayée...');
        console.log('JSON envoyé:', JSON.stringify(this.demandeCarteDTO, null, 2));

        this.carteService.createDemandeCarte(this.demandeCarteDTO)
            .subscribe({
                next: (response) => {
                    console.log('Réponse reçue du backend:', response);

                    // Vérifier si la réponse est valide
                    if (response && response.success) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Succès',
                            text: response.message || 'Demande de carte postpayée créée avec succès.',
                        });
                    } else {
                        Swal.fire({
                            icon: 'warning',
                            title: 'Avertissement',
                            text: response.message || 'Réponse inattendue du serveur.',
                        });
                    }
                },
                error: (err) => {
                    console.error('Erreur lors de la création de la carte postpayée:', err);

                    let errorMessage = 'Une erreur est survenue lors de la demande de carte.';

                    if (err.error) {
                        if (typeof err.error === 'object' && err.error.message) {
                            errorMessage = err.error.message;
                        } else if (typeof err.error === 'string') {
                            errorMessage = err.error;
                        }
                    }

                    if (err.status === 0) {
                        errorMessage = 'Erreur réseau. Vérifiez votre connexion Internet.';
                    }

                    if (err.status === 400) {
                        console.error('Erreur 400 - Bad Request:', err.error);
                    }

                    if (err.status === 500) {
                        errorMessage = 'Une erreur interne est survenue. Veuillez réessayer plus tard.';
                    }

                    Swal.fire({
                        icon: 'error',
                        title: 'Erreur',
                        text: errorMessage,
                    });
                }
            });
    } else {
        console.log('Envoi de la demande de carte prépayée...');
        this.carteService.createDemandeCartePrepayee(this.demandeCarteDTO)
            .subscribe({
                next: (response) => {
                    console.log('Réponse reçue du backend:', response);

                    // Vérifier si la réponse est valide
                    if (response && response.success) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Succès',
                            text: response.message || 'Demande de carte prépayée créée avec succès.',
                        });
                    } else {
                        Swal.fire({
                            icon: 'warning',
                            title: 'Avertissement',
                            text: response.message || 'Réponse inattendue du serveur.',
                        });
                    }
                },
                error: (err) => {
                    console.error('Erreur lors de la création de la carte prépayée:', err);

                    const errorMessage = err.error?.message || err.error || 'Une erreur est survenue lors de la demande de carte prépayée.';

                    if (err.status === 400) {
                        console.error('Erreur 400 - Bad Request:', err.error);
                    }

                    Swal.fire({
                        icon: 'error',
                        title: 'Erreur',
                        text: errorMessage,
                    });
                }
            });
    }
}}
