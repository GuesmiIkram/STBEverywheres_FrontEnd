import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CarteDTO } from 'src/app/Models/CarteDTO';
import { CarteService } from 'src/app/services/carte.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recharge-mes-cartes',
  templateUrl: './recharge-mes-cartes.component.html',
  styleUrls: ['./recharge-mes-cartes.component.scss']
})
export class RechargeMesCartesComponent implements OnInit {
  rechargeForm: FormGroup;
  mesCartes: CarteDTO[] = [];
  cartesRecepteur: CarteDTO[] = []; // Nouvelle liste pour les cartes destinataires

  constructor(
    private fb: FormBuilder,
    private carteService: CarteService
  ) {
    this.rechargeForm = this.fb.group({
      carteEmetteurNum: ['', Validators.required],
      carteRecepteurNum: ['', Validators.required],
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
        this.cartesRecepteur = [...this.mesCartes]; // Initialisation
        
        if (this.mesCartes.length > 0) {
          // Initialiser les valeurs par défaut si au moins 2 cartes disponibles
          if (this.mesCartes.length >= 2) {
            this.rechargeForm.patchValue({
              carteEmetteurNum: this.mesCartes[0].numCarte,
              carteRecepteurNum: this.mesCartes[1].numCarte
            });
            this.updateCartesRecepteur(this.mesCartes[0].numCarte);
          }
        }
      },
      error: (err) => {
        console.error('Erreur chargement cartes:', err);
        Swal.fire('Erreur', 'Impossible de charger vos cartes', 'error');
      }
    });
  }

  onEmetteurChange(): void {
    const carteEmetteurNum = this.rechargeForm.get('carteEmetteurNum')?.value;
    if (carteEmetteurNum) {
      this.updateCartesRecepteur(carteEmetteurNum);
      
      // Réinitialiser la sélection du destinataire si c'est la même carte
      if (this.rechargeForm.get('carteRecepteurNum')?.value === carteEmetteurNum) {
        this.rechargeForm.patchValue({ carteRecepteurNum: '' });
      }
    }
  }

  private updateCartesRecepteur(carteEmetteurNum: string): void {
    // Filtrer pour exclure la carte émettrice
    this.cartesRecepteur = this.mesCartes.filter(c => c.numCarte !== carteEmetteurNum);
  }

  onSubmit(): void {
    if (this.rechargeForm.invalid) {
      Swal.fire('Erreur', 'Veuillez vérifier les informations saisies', 'error');
      return;
    }

    const formData = this.rechargeForm.value;

    if (formData.carteEmetteurNum === formData.carteRecepteurNum) {
      Swal.fire('Erreur', 'Vous ne pouvez pas recharger la même carte', 'error');
      return;
    }

    // Trouver les cartes sélectionnées pour afficher leurs détails
    const carteEmetteur = this.mesCartes.find(c => c.numCarte === formData.carteEmetteurNum);
    const carteRecepteur = this.mesCartes.find(c => c.numCarte === formData.carteRecepteurNum);

    Swal.fire({
      title: 'Confirmation de transfert',
      html: `Voulez-vous vraiment transférer <b>TND ${formData.montant}</b> depuis votre carte 
             <b>${carteEmetteur?.typeCarte || ''} (${formData.carteEmetteurNum})</b> 
             vers votre carte <b>${carteRecepteur?.typeCarte || ''} (${formData.carteRecepteurNum})</b> ?`,
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
    this.carteService.rechargerCarte({
      carteEmetteurNum: formData.carteEmetteurNum.replace(/\s/g, ''),
      carteRecepteurNum: formData.carteRecepteurNum.replace(/\s/g, ''),
      montant: formData.montant
    }).subscribe({
      next: () => {
        Swal.fire('Succès', 'Recharge effectuée avec succès', 'success');
        this.rechargeForm.reset();
        this.loadMesCartes(); // Recharger les soldes
      },
      error: (err) => {
        const errorMsg = err.error?.message || 'Erreur lors de la recharge';
        Swal.fire('Erreur', errorMsg, 'error');
      }
    });
  }
}