import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CarteDTO } from 'src/app/Models/CarteDTO';
import { CarteService } from 'src/app/services/carte.service';
import Swal from 'sweetalert2';

interface SecurityFormData {
  cvv: string;
  expiry: string;
}

@Component({
  selector: 'app-recharge-mes-cartes',
  templateUrl: './recharge-mes-cartes.component.html',
  styleUrls: ['./recharge-mes-cartes.component.scss']
})
export class RechargeMesCartesComponent implements OnInit {
  rechargeForm: FormGroup;
  mesCartes: CarteDTO[] = [];
  cartesRecepteur: CarteDTO[] = [];
  selectedCarteEmetteur: CarteDTO | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private carteService: CarteService
  ) {
    this.rechargeForm = this.fb.group({
      carteEmetteurNum: ['', Validators.required],
      carteRecepteurNum: ['', Validators.required],
      montant: ['', [Validators.required, Validators.min(0.1), Validators.pattern(/^\d+(\.\d{1,2})?$/)]]
    });
  }

  ngOnInit(): void {
    this.loadMesCartes();
  }

  loadMesCartes(): void {
    this.isLoading = true;
    this.carteService.getCartesByClientId().subscribe({
      next: (cartes) => {
        this.mesCartes = cartes.filter(c => c.statut === 'Active');
        this.cartesRecepteur = [...this.mesCartes];

        if (this.mesCartes.length >= 2) {
          this.rechargeForm.patchValue({
            carteEmetteurNum: this.mesCartes[0].numCarte,
            carteRecepteurNum: this.mesCartes[1].numCarte
          });
          this.selectedCarteEmetteur = this.mesCartes[0];
          this.updateCartesRecepteur();
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur chargement cartes:', err);
        Swal.fire('Erreur', 'Impossible de charger vos cartes', 'error');
        this.isLoading = false;
      }
    });
  }

  onEmetteurChange(): void {
    const carteEmetteurNum = this.rechargeForm.get('carteEmetteurNum')?.value;
    this.selectedCarteEmetteur = this.mesCartes.find(c => c.numCarte === carteEmetteurNum) || null;
    this.updateCartesRecepteur();
  }

  private updateCartesRecepteur(): void {
    const currentEmetteur = this.rechargeForm.get('carteEmetteurNum')?.value;
    this.cartesRecepteur = this.mesCartes.filter(c => c.numCarte !== currentEmetteur);

    if (this.rechargeForm.get('carteRecepteurNum')?.value === currentEmetteur) {
      this.rechargeForm.patchValue({ carteRecepteurNum: '' });
    }
  }

  async onSubmit(): Promise<void> {
    if (this.rechargeForm.invalid) {
      this.markFormGroupTouched(this.rechargeForm);
      Swal.fire('Erreur', 'Veuillez vérifier les informations saisies', 'error');
      return;
    }

    const formData = this.rechargeForm.value;
    const carteRecepteur = this.mesCartes.find(c => c.numCarte === formData.carteRecepteurNum);

    if (formData.carteEmetteurNum === formData.carteRecepteurNum) {
      Swal.fire('Erreur', 'Vous ne pouvez pas recharger la même carte', 'error');
      return;
    }

    const { value: securityData } = await Swal.fire<SecurityFormData>({
      title: 'Validation de sécurité',
      html: `
        <div class="text-left mb-3">
          <p>Veuillez saisir les informations de sécurité de votre carte :</p>
        </div>
        <div class="form-group text-left">
          <label for="swal-cvv">Code CVV (3 chiffres)</label>
          <input id="swal-cvv" class="swal2-input" type="password" maxlength="3" placeholder="•••">
        </div>
        <div class="form-group text-left mt-3">
          <label for="swal-expiry">Date d'expiration (MM/AA)</label>
          <input id="swal-expiry" class="swal2-input" maxlength="5" placeholder="MM/AA">
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Valider',
      cancelButtonText: 'Annuler',
      preConfirm: () => {
        const cvv = (document.getElementById('swal-cvv') as HTMLInputElement)?.value;
        const expiry = (document.getElementById('swal-expiry') as HTMLInputElement)?.value;
        return { cvv, expiry };
      },
      inputValidator: (value: SecurityFormData | string) => {
        // Vérifier si value est de type string (erreur) ou SecurityFormData
        if (typeof value === 'string') {
          return value; // Renvoie le message d'erreur existant
        }

        if (!value?.cvv || !value?.expiry) {
          return 'Tous les champs sont obligatoires';
        }
        if (!/^\d{3}$/.test(value.cvv)) {
          return 'Le CVV doit contenir exactement 3 chiffres';
        }
        if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(value.expiry)) {
          return 'Format de date invalide (MM/AA)';
        }
        return null;
      }
    });

    if (!securityData) return;
Swal.fire({
  title: 'Traitement en cours...',
html: 'Veuillez patienter pendant le traitement de votre recharge. Cette opération peut prendre quelques instants. Merci de ne pas fermer cette fenêtre.',  allowOutsideClick: false,
  didOpen: () => {
    Swal.showLoading();
  }
});

this.isLoading = true;
    this.isLoading = true;
    this.carteService.rechargerCarte({
      carteEmetteurNum: formData.carteEmetteurNum.replace(/\s/g, ''),
      carteRecepteurNum: formData.carteRecepteurNum.replace(/\s/g, ''),
      montant: formData.montant,
      cvv: securityData.cvv,
      dateExpiration: securityData.expiry
    }).subscribe({
      next: () => {
        Swal.fire({
          title: 'Succès',
          text: 'Recharge effectuée avec succès',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
        this.rechargeForm.reset();
        this.loadMesCartes();
      },
     error: (err) => {
             console.error('Erreur lors de la recharge:', err);
             
             let errorMsg = 'Une erreur est survenue lors de la recharge';
             
             if (err.error) {
               // Gestion des différents formats d'erreur
               if (err.error.message) {
                 errorMsg = err.error.message;
               } else if (err.error.error) {
                 errorMsg = err.error.error;
               } else if (err.error.errors) {
                 errorMsg = Object.values(err.error.errors).join('\n');
               } else if (typeof err.error === 'string') {
                 errorMsg = err.error;
               }
             } else if (err.message) {
               errorMsg = err.message;
             }
     
             Swal.fire({
               title: 'Erreur',
               text: errorMsg,
               icon: 'error',
               confirmButtonText: 'OK'
             });
           },
           complete: () => {
             this.isLoading = false;
           }
         });
       }
     

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
