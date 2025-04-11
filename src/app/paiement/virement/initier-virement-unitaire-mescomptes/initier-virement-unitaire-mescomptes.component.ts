import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Compte } from 'src/app/Models/compte';
import { VirementService } from 'src/app/services/virement.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-initier-virement-unitaire-mescomptes',
  templateUrl: './initier-virement-unitaire-mescomptes.component.html',
  styleUrls: ['./initier-virement-unitaire-mescomptes.component.scss']
})
export class InitierVirementUnitaireMesComptesComponent implements OnInit {

comptes: Compte[] = [];
  virementForm: FormGroup;
  comptesBeneficiaires: Compte[] = [];
  soldeCompteSelectionne: number | null = null; // stocker le solde de compte emetteur
  // Ajoutez cette propriété dans votre composant
private swalFireConfig = {
  customClass: {
    container: 'swal-container',
    popup: 'swal-popup',
    title: 'swal-title',
    htmlContainer: 'swal-html',
    confirmButton: 'swal-confirm-btn',
    cancelButton: 'swal-cancel-btn'
  },
  confirmButtonColor: '#3366cc',
  cancelButtonColor: '#6c757d',
  buttonsStyling: true,
  showCloseButton: true,
  showCancelButton: true,
  focusCancel: true
};

  constructor(private virementService: VirementService, private fb: FormBuilder) {
    this.virementForm = this.fb.group({
      compteEmetteur: ['', Validators.required],
      montant: ['', [Validators.required, Validators.min(1)]],
      motif: ['', Validators.required],

      ribBeneficiaire: ['', Validators.required],
      description: ['']

    });
    console.log('Formulaire initialisé :', this.virementForm.value);
  }

  ngOnInit(): void {
    this.virementService.getComptesClient().subscribe(
      (data: Compte[]) => { // Ajout du type `Compte[]`
        this.comptes = data;
        this.comptesBeneficiaires = data;
      },
      (error) => { console.error('Erreur lors du chargement des comptes :', error); }
    );

// Mettre à jour la liste des bénéficiaires lorsque le compte émetteur change
this.virementForm.get('compteEmetteur')?.valueChanges.subscribe((selectedCompteEmetteur) => {
  this.comptesBeneficiaires = this.comptes.filter(compte => compte.rib !== selectedCompteEmetteur);
  // Trouver le compte sélectionné pour extraire le solde de compte emetteur
  const compteSelectionne = this.comptes.find(compte => compte.rib === selectedCompteEmetteur);
  this.soldeCompteSelectionne = compteSelectionne ? compteSelectionne.solde : null;
});

  }
//envoi de virement
effectuerVirement(): void {
  // Validation du formulaire
  if (!this.virementForm.valid) {
    Swal.fire({
      title: 'Formulaire incomplet',
      html: `
        <div style="text-align: center;">
          <i class="fas fa-exclamation-circle" style="color: #dc3545; font-size: 48px; margin-bottom: 15px;"></i>
          <p>Veuillez remplir tous les champs obligatoires.</p>
        </div>
      `,
      ...this.swalFireConfig,
      showCancelButton: false
    });
    return;
  }

  const virementData = {
    RIB_Emetteur: this.virementForm.value.compteEmetteur,
    RIB_Recepteur: this.virementForm.value.ribBeneficiaire,
    Montant: this.virementForm.value.montant,
    Motif: this.virementForm.value.motif,
    Description: this.virementForm.value.description,
    TypeVirement: 'VirementUnitaireVersMescomptes',
  };

  // Confirmation
  Swal.fire({
    title: 'Confirmer le virement',
    html: `
      <div style="text-align: left; margin: 15px 0; font-size: 15px;">
        <p><strong>Compte émetteur:</strong> ${virementData.RIB_Emetteur}</p>
        <p><strong>Compte bénéficiaire:</strong> ${virementData.RIB_Recepteur}</p>
        <p><strong>Montant:</strong> ${virementData.Montant.toFixed(2)} TND</p>
        <p><strong>Motif:</strong> ${virementData.Motif}</p>
      </div>
      <div style="font-size: 13px; color: #666; margin-top: 20px; border-top: 1px solid #eee; padding-top: 10px;">
        <p>En confirmant, vous autorisez le débit immédiat de votre compte.</p>
      </div>
    `,
    icon: 'question',
    confirmButtonText: 'Confirmer le virement',
    cancelButtonText: 'Annuler',
    ...this.swalFireConfig
  }).then((result) => {
    if (result.isConfirmed) {
      this.virementService.effectuerVirement(virementData).subscribe({
        next: (response) => {
          Swal.fire({
            title: 'Virement effectué',
            html: `
              <div style="text-align: center;">
                <i class="fas fa-check-circle" style="color: #28a745; font-size: 48px; margin-bottom: 15px;"></i>
                <p>Votre virement a été exécuté avec succès.</p>
                <p><strong>Motif:</strong> ${virementData.Motif}</p>
                <p><strong>Montant:</strong> ${virementData.Montant.toFixed(2)} TND</p>
              </div>
              <div style="font-size: 13px; color: #666; margin-top: 20px; border-top: 1px solid #eee; padding-top: 10px;">
                <p><i class="fas fa-mobile-alt" style="color: #3366cc; margin-right: 5px;"></i> Une notification SMS a été envoyée.</p>
                <p><i class="fas fa-exchange-alt" style="color: #3366cc; margin-right: 5px;"></i> Les fonds ont été transférés immédiatement.</p>
              </div>
            `,
            ...this.swalFireConfig,
            showCancelButton: false
          });
          this.virementForm.reset();
        },
        error: (error) => {
          Swal.fire({
            title: 'Échec du virement',
            html: `
              <div style="text-align: center;">
                <i class="fas fa-times-circle" style="color: #dc3545; font-size: 48px; margin-bottom: 15px;"></i>
                <p>${error.error?.message || 'Une erreur est survenue lors du virement.'}</p>
                ${error.error?.details ? `<p style="font-size: 13px; color: #666;">${error.error.details}</p>` : ''}
              </div>
            `,
            ...this.swalFireConfig,
            showCancelButton: false
          });
        }
      });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire({
        title: 'Opération annulée',
        html: `
          <div style="text-align: center;">
            <i class="fas fa-info-circle" style="color: #17a2b8; font-size: 48px; margin-bottom: 15px;"></i>
            <p>Le virement n'a pas été effectué.</p>
          </div>
        `,
        ...this.swalFireConfig,
        showCancelButton: false
      });
    }
  });
}}
