import { Component, OnInit } from '@angular/core';
import { NomCarte } from 'src/app/enums/nom-carte.enum';
import { TypeCarte } from 'src/app/enums/type-carte.enum';
import { DemandeCarte } from 'src/app/Models/DemandeCarte';
import Swal from 'sweetalert2';
import { CarteService } from 'src/app/services/carte.service';
import { CompteService } from 'src/app/services/compte.service';
import { Compte } from 'src/app/Models/compte';
import { VirementService } from 'src/app/services/virement.service';

@Component({
  selector: 'app-delivrer-carte',
  templateUrl: './delivrer-carte.component.html',
  styleUrls: ['./delivrer-carte.component.scss']
})
export class DelivrerCarteComponent implements OnInit {
  demandeCarteDTO: DemandeCarte = {
    NumCompte: '',
    NomCarte: '' as NomCarte,
    TypeCarte: TypeCarte.National,
    CIN: '',
    Email: '',
    NumTel: '',
  };

  // Séparation claire des cartes postpayées et prépayées
  cartesPostpayees: NomCarte[] = [
    NomCarte.VisaClassic,
    NomCarte.Mastercard,
    NomCarte.Tecno,
    NomCarte.VisaPlatinum,
    NomCarte.CIB,
    NomCarte.Epargne
  ];

  cartesPrepayees: NomCarte[] = [
    NomCarte.C_cash,
    NomCarte.C_pay
  ];

  // Options dynamiques pour le selecteur
  nomCarteOptions: NomCarte[] = [];
  typeCarteOptions = Object.values(TypeCarte);
  isPostpayee: boolean = true; // Par défaut : postpayée
  comptes: Compte[] = [];

  constructor(
    private carteService: CarteService,
    private compteService: CompteService,
    private virementService: VirementService
  ) {}

  ngOnInit(): void {
    this.updateNomCarteOptions();
    this.loadComptes();
  }

  loadComptes(): void {
    this.compteService.getComptesByCin().subscribe(
      (data: Compte[]) => {
        this.comptes = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des comptes :', error);
      }
    );
  }

  onTypeCarteChange(): void {
    this.updateNomCarteOptions();
    if (!this.isPostpayee) {
      this.demandeCarteDTO.NumCompte = '';
    }
  }

  updateNomCarteOptions(): void {
    this.nomCarteOptions = this.isPostpayee 
      ? this.cartesPostpayees 
      : this.cartesPrepayees;
    
    // Réinitialiser la sélection si non valide
    if (this.demandeCarteDTO.NomCarte && !this.nomCarteOptions.includes(this.demandeCarteDTO.NomCarte)) {
      this.demandeCarteDTO.NomCarte = '' as NomCarte;
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
              text: response.message || 'Demande de carte postpayée créée avec succès.',
            });
          },
          error: (err) => {
            this.handleError(err);
          }
        });
    } else {
      this.carteService.createDemandeCartePrepayee(this.demandeCarteDTO)
        .subscribe({
          next: (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Succès',
              text: response.message || 'Demande de carte prépayée créée avec succès.',
            });
          },
          error: (err) => {
            this.handleError(err);
          }
        });
    }
  }

  private handleError(err: any): void {
    console.error('Erreur:', err);
    let errorMessage = 'Une erreur est survenue lors de la demande de carte.';

    if (err.error) {
      errorMessage = err.error.message || JSON.stringify(err.error);
    }

    if (err.status === 0) {
      errorMessage = 'Erreur réseau. Vérifiez votre connexion Internet.';
    }

    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: errorMessage,
    });
  }
}