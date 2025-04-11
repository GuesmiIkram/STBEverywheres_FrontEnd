import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CarteDTO } from 'src/app/Models/CarteDTO';
import { CarteService } from 'src/app/services/carte.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recharge-autres-cartes',
  templateUrl: './recharge-autres-cartes.component.html',
  styleUrls: ['./recharge-autres-cartes.component.scss']
})
export class RechargeAutresCartesComponent implements OnInit {
  rechargeForm: FormGroup;
  mesCartes: CarteDTO[] = [];

  constructor(
    private fb: FormBuilder,
    private carteService: CarteService
  ) {
    this.rechargeForm = this.fb.group({
      carteEmetteurNum: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      carteRecepteurNum: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      montant: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadMesCartes();
  }

  loadMesCartes(): void {
    this.carteService.getCartesByClientId().subscribe({
      next: (cartes) => {
        this.mesCartes = cartes.filter(c => c.statut === 'Active');
        if (this.mesCartes.length > 0) {
          this.rechargeForm.patchValue({
            carteEmetteurNum: this.mesCartes[0].numCarte
          });
        }
      },
      error: (err) => {
        console.error('Erreur chargement cartes:', err);
        Swal.fire('Erreur', 'Impossible de charger vos cartes', 'error');
      }
    });
  }

  onSubmit(): void {
    if (this.rechargeForm.invalid) {
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

    Swal.fire({
      title: 'Confirmation de transfert',
      html: `Voulez-vous vraiment transférer <b>TND ${formData.montant}</b> depuis votre carte <b>${carteEmetteur?.typeCarte || ''} (${formData.carteEmetteurNum})</b> vers la carte <b>${formData.carteRecepteurNum}</b> ?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, transférer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.processRecharge(formData);
      }
    });
  }

  private processRecharge(formData: any): void {
    this.carteService.rechargerCarte(formData).subscribe({
      next: () => {
        Swal.fire('Succès', 'Recharge effectuée avec succès', 'success');
        this.rechargeForm.reset();
        this.loadMesCartes();
      },
      error: (err) => {
        const errorMsg = err.error?.message || 'Erreur lors de la recharge';
        Swal.fire('Erreur', errorMsg, 'error');
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