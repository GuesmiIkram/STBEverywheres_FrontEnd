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

  isFormValid(): boolean {
    // Vérification des champs de base
    const basicFieldsValid = Boolean(
      this.demandeCarteDTO.NomCarte && 
      this.demandeCarteDTO.TypeCarte && 
      this.demandeCarteDTO.CIN && 
      this.demandeCarteDTO.Email && 
      this.demandeCarteDTO.NumTel
    );
  
    // Pour les cartes postpayées, vérifier aussi le numéro de compte
    if (this.isPostpayee) {
      return basicFieldsValid && Boolean(this.demandeCarteDTO.NumCompte);
    }
  
    return basicFieldsValid;
}
private static readonly FRAIS_CARTES = new Map<NomCarte, number>([
  [NomCarte.VisaClassic, 35],
  [NomCarte.Mastercard, 35],
  [NomCarte.Tecno, 15],
  [NomCarte.VisaPlatinum, 150],
  [NomCarte.VisaInfinite, 200],
  [NomCarte.MastercardGold, 90],
  [NomCarte.C_cash, 10],
  [NomCarte.C_pay, 10],
  [NomCarte.CIB, 20],
  [NomCarte.Epargne, 0]
]);

getFraisCarte(nomCarte: NomCarte): number {
  return DelivrerCarteComponent.FRAIS_CARTES.get(nomCarte) ?? 0;
}
onSubmit(): void {
  const frais = this.getFraisCarte(this.demandeCarteDTO.NomCarte);
  const messageFrais = frais > 0 
    ? `<p class="frais-notification">Frais de la carte : <strong>${frais} TND</strong></p>`
    : '<p class="frais-notification">Aucun frais pour cette carte</p>';

  if (this.isPostpayee) {
    this.carteService.createDemandeCarte(this.demandeCarteDTO)
      .subscribe({
        next: (response) => {
          Swal.fire({
            title: 'Demande enregistrée',
            html: `
              <div style="text-align: left;">
                ${messageFrais}
                <p>Votre demande de carte a bien été transmise à notre service.</p>
                <p><strong>Vous recevrez un email dès que votre carte sera prête.</strong></p>
                <ul style="padding-left: 20px; margin-top: 10px;">
                  <li>Délai de traitement : généralement sous 48h ouvrées</li>
                  <li>Pour toute question, contactez votre conseiller</li>
                </ul>
              </div>
            `,
            icon: 'success',
            confirmButtonText: 'Compris',
            confirmButtonColor: '#3085d6',
            focusConfirm: false,
            customClass: {
              popup: 'custom-swal-popup',
              htmlContainer: 'custom-html-container'
            }
          });
          this.resetForm();
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
            title: 'Demande enregistrée',
            html: `
              <div style="text-align: left;">
                ${messageFrais}
                <p>Votre demande de carte prépayée a bien été transmise à notre service.</p>
                <p><strong>Vous recevrez un email dès que votre carte sera prête.</strong></p>
                <ul style="padding-left: 20px; margin-top: 10px;">
                  <li>Délai de traitement : généralement sous 48h ouvrées</li>
                  <li>Pour toute question, contactez votre conseiller</li>
                </ul>
              </div>
            `,
            icon: 'success',
            confirmButtonText: 'Compris',
            confirmButtonColor: '#3085d6',
            focusConfirm: false,
            customClass: {
              popup: 'custom-swal-popup',
              htmlContainer: 'custom-html-container'
            }
          });
          this.resetForm();
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

    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: errorMessage,
    });
  }
  private resetForm(): void {
    this.demandeCarteDTO = {
      NumCompte: '',
      NomCarte: '' as NomCarte,
      TypeCarte: TypeCarte.National, 
      CIN: '',
      Email: '',
      NumTel: '',
    };
    
    this.isPostpayee = true;
    this.updateNomCarteOptions();
  }
}