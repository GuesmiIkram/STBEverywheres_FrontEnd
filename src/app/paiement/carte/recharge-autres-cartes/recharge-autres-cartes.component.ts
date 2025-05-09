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
  selector: 'app-recharge-autres-cartes',
  templateUrl: './recharge-autres-cartes.component.html',
  styleUrls: ['./recharge-autres-cartes.component.scss']
})
export class RechargeAutresCartesComponent implements OnInit {
  rechargeForm: FormGroup;
  mesCartes: CarteDTO[] = [];
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private carteService: CarteService
  ) {
    this.rechargeForm = this.fb.group({
      carteEmetteurNum: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      carteRecepteurNum: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
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
        if (this.mesCartes.length > 0) {
          this.rechargeForm.patchValue({
            carteEmetteurNum: this.mesCartes[0].numCarte
          });
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

  async onSubmit(): Promise<void> {
    if (this.rechargeForm.invalid) {
      this.markFormGroupTouched(this.rechargeForm);
      Swal.fire('Erreur', 'Veuillez vérifier les informations saisies', 'error');
      return;
    }

    const formData = {
      ...this.rechargeForm.value,
      carteEmetteurNum: this.rechargeForm.value.carteEmetteurNum.replace(/\s/g, ''),
      carteRecepteurNum: this.rechargeForm.value.carteRecepteurNum.replace(/\s/g, '')
    };

    if (formData.carteEmetteurNum === formData.carteRecepteurNum) {
      Swal.fire('Erreur', 'Vous ne pouvez pas recharger la même carte', 'error');
      return;
    }

    // Trouver la carte émettrice pour afficher son type dans la confirmation
    const carteEmetteur = this.mesCartes.find(c => c.numCarte === formData.carteEmetteurNum);

    const confirmResult = await Swal.fire({
      title: 'Confirmation de transfert',
      html: `Voulez-vous vraiment transférer <b>TND ${formData.montant}</b> depuis votre carte 
             <b>${carteEmetteur?.typeCarte || ''} (${formData.carteEmetteurNum})</b> 
             vers la carte <b>${formData.carteRecepteurNum}</b> ?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, continuer',
      cancelButtonText: 'Annuler'
    });

    if (!confirmResult.isConfirmed) return;

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
        if (typeof value === 'string') {
          return value;
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

    this.isLoading = true;
    this.carteService.rechargerCarte({
      ...formData,
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
        const errorMsg = err.error?.message || 'Une erreur est survenue lors de la recharge';
        Swal.fire('Erreur', errorMsg, 'error');
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

  removeSpaces(event: any): void {
    const input = event.target as HTMLInputElement;
    const cursorPosition = input.selectionStart;
    const initialValue = input.value;
    
    const newValue = initialValue.replace(/\s/g, '');
    input.value = newValue;
    
    const spacesRemoved = initialValue.length - newValue.length;
    const newCursorPosition = cursorPosition ? Math.max(0, cursorPosition - spacesRemoved) : 0;
    input.setSelectionRange(newCursorPosition, newCursorPosition);
    
    this.rechargeForm.get('carteRecepteurNum')?.setValue(newValue, { emitEvent: false });
  }
}