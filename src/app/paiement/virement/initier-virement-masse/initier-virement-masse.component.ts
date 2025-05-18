import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Compte } from 'src/app/Models/compte';
import { VirementService } from 'src/app/services/virement.service';
import { Beneficiaire } from 'src/app/Models/Beneficiaire';
import { BeneficiaireService } from 'src/app/services/beneficiaire.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddBeneficiaireComponent } from 'src/app/paiement/beneficiaires/add-beneficiaire/add-beneficiaire.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-initier-virement-masse',
  templateUrl: './initier-virement-masse.component.html',
  styleUrls: ['./initier-virement-masse.component.scss']
})
export class InitierVirementMasseComponent implements OnInit {
  virementForm: FormGroup;
  showOtpField = false;
  fichier: File | null = null;
  methodeVirement: string = 'form';
  soldeCompteSelectionne: number | null = null;
  beneficiaires: Beneficiaire[] = [];
  comptes: Compte[] = [];
  isProcessing = false;
  otpRequested = false;
otpSaisi: string | null = null;
  private static readonly TVA = 0.885;
  constructor(
    private fb: FormBuilder,
    private virementService: VirementService,
    private beneficiaireService: BeneficiaireService,
    private modalService: NgbModal
  ) {
    this.virementForm = this.fb.group({
      ribEmetteur: ['', Validators.required],
      motif: ['', Validators.required],
      description: [''],
      otp: [''],
      beneficiaires: this.fb.array([this.createBeneficiaireGroup()])
    });
  }
formatTND(valeur: number): string {
  return new Intl.NumberFormat('fr-TN', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(valeur) + ' TND';
}

  ngOnInit(): void {
    this.chargerComptes();
    this.chargerBeneficiaires();

    this.virementForm.get('ribEmetteur')?.valueChanges.subscribe((ribEmetteur: string) => {
      const compteSelectionne = this.comptes.find(compte => compte.rib === ribEmetteur);
      this.soldeCompteSelectionne = compteSelectionne ? compteSelectionne.solde : null;
    });
  }

  createBeneficiaireGroup(): FormGroup {
    return this.fb.group({
      idBeneficiaire: ['', Validators.required],
      montant: ['', [Validators.required, Validators.min(0.01)]]
    });
  }

  get beneficiairesFormArray(): FormArray {
    return this.virementForm.get('beneficiaires') as FormArray;
  }

  chargerComptes(): void {
    this.virementService.getComptesClient().subscribe(
      (data: Compte[]) => {
        this.comptes = data;
      },
      (error: any) => {
        console.error('Erreur lors du chargement des comptes :', error);
        Swal.fire('Erreur', 'Impossible de charger les comptes', 'error');
      }
    );
  }

  /*chargerBeneficiaires(): void {
    this.beneficiaireService.getBeneficiairesByClientId().subscribe({
      next: (data: Beneficiaire[]) => {
        this.beneficiaires = data;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des bénéficiaires:', error);
        Swal.fire('Erreur', 'Impossible de charger les bénéficiaires', 'error');
      }
    });
  }*/
chargerBeneficiaires(): void {
  this.beneficiaireService.getBeneficiairesByClientId().subscribe({
    next: (data: Beneficiaire[]) => {
      this.beneficiaires = data;
    },
    error: (error: any) => {
      // Si c’est un 404 "Aucun bénéficiaire trouvé", ne rien faire
      if (
        error.status === 404 &&
        error.error &&
        typeof error.error === 'string' &&
        error.error.includes('Aucun bénéficiaire')
      ) {
        this.beneficiaires = []; // Juste initialiser à vide
        return;
      }

      // Sinon, afficher une vraie erreur
      console.error('Erreur lors du chargement des bénéficiaires:', error);
      Swal.fire('Erreur', 'Impossible de charger les bénéficiaires', 'error');
    }
  });
}

  ajouterBeneficiaire(): void {
    this.beneficiairesFormArray.push(this.createBeneficiaireGroup());
  }

  supprimerBeneficiaire(index: number): void {
    if (this.beneficiairesFormArray.length > 1) {
      this.beneficiairesFormArray.removeAt(index);
    }
  }

  onMethodChange(methode: string): void {
    this.methodeVirement = methode;
    this.showOtpField = false;
    this.otpRequested = false;
    this.virementForm.reset();
    this.beneficiairesFormArray.clear();
    this.ajouterBeneficiaire();
  }

  onFileChange(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.fichier = event.target.files[0];
    }
  }

  onSubmit(): void {
    if (this.methodeVirement === 'file') {
      this.submitFile();
    } else {
      this.submitForm();
    }
  }
submitFile(): void {
  if (!this.fichier) {
    Swal.fire('Erreur', 'Veuillez sélectionner un fichier valide', 'error');
    return;
  }

  this.isProcessing = true;
  const formData = new FormData();
  formData.append('Fichier', this.fichier, this.fichier.name);

  if (this.showOtpField) {
    if (!this.otpSaisi || this.otpSaisi.length !== 6) {
      this.isProcessing = false;
      Swal.fire('Erreur', 'Veuillez saisir un code OTP valide (6 chiffres)', 'error');
      return;
    }
    formData.append('OtpSaisi', this.otpSaisi);
  }

  this.virementService.uploadVirementMasseFile(formData).subscribe({
    next: (response) => {
      this.isProcessing = false;

      // ✅ Mise à jour ici
      if (response.besoinOtp && !this.showOtpField) {
        this.showOtpField = true;
        Swal.fire('Code OTP envoyé', response.message || 'Un code de vérification a été envoyé.', 'info');
      } else {
        Swal.fire({
          title: 'Succès',
          html: `

            <div style="text-align: center;">
              <i class="fas fa-check-circle" style="color: #28a745; font-size: 48px; margin-bottom: 15px;"></i>
              <p>Virement de masse effectué avec succès !</p>
              <p><strong>Nombre de virements:</strong> ${response.nombreVirements}</p>
              <p><strong>Montant total:</strong> ${this.formatTND(response.totalDebite)|| 'Non spécifié'} </p>
              <p><strong>Frais appliqués:</strong>  ${this.formatTND(response.frais)|| 'Non spécifié'}</p>
            </div>
            <div style="font-size: 13px; color: #666; margin-top: 20px; border-top: 1px solid #eee; padding-top: 10px;">
              <p><i class="fas fa-file-alt" style="color: #3366cc; margin-right: 5px;"></i> Fichier traité: ${this.fichier?.name}</p>
            </div>
          `,
          confirmButtonText: 'Fermer',
          confirmButtonColor: '#3366cc'
        });
        // Reset
        this.fichier = null;
        this.otpSaisi = '';
        this.showOtpField = false;
      }
    },
    error: (error) => {
      this.isProcessing = false;
      console.error('Erreur', error);
      Swal.fire('Erreur', error.error?.message || 'Erreur lors du traitement', 'error');
    }
  });
}



  submitForm(): void {
    if (this.virementForm.invalid) {
      Swal.fire('Erreur', 'Veuillez remplir tous les champs obligatoires', 'error');
      return;
    }

    //const formValue = this.virementForm.value;
    const formValue = {
  ...this.virementForm.value,
  description: this.virementForm.value.description ?? ''
};

    const totalMontant = this.calculateTotalAmount();
    const compteEmetteur = this.comptes.find(c => c.rib === formValue.ribEmetteur);

    if (!compteEmetteur) {
      Swal.fire('Erreur', 'Compte émetteur introuvable', 'error');
      return;
    }

    const frais = this.calculateFees();
    const totalAvecFrais = totalMontant + frais;
    const soldeDisponible = compteEmetteur.solde + (compteEmetteur.decouvertAutorise || 0);

    if (soldeDisponible < totalAvecFrais) {
      Swal.fire({
        title: 'Solde insuffisant',
        html: `Solde disponible: ${compteEmetteur.solde} TND<br>
               Découvert autorisé: ${compteEmetteur.decouvertAutorise || 0} TND<br>
               Total à débiter: ${totalAvecFrais.toFixed(2)} TND<br>
               <span style="color: red;">Votre solde est insuffisant</span>`,
        icon: 'warning'
      });
      return;
    }

    if (!this.otpRequested) {
      this.requestOtp();
    } else {
      this.processVirement();
    }
  }

  private calculateTotalAmount(): number {
    return this.virementForm.value.beneficiaires.reduce(
      (sum: number, benef: any) => sum + Number(benef.montant), 0
    );
  }

  private calculateFees(): number {
    const nombreBeneficiaires = this.virementForm.value.beneficiaires.length;
    let frais = 5.0;
    if (nombreBeneficiaires > 5) frais += (nombreBeneficiaires - 5) * 0.5;
    return frais;
  }

 private requestOtp(): void {
  this.isProcessing = true;
const montant = this.calculateTotalAmount();
const frais = this.calculateFees();
const tva = InitierVirementMasseComponent.TVA;
const totalAvecTVA = montant + frais + tva;
 Swal.fire({
  title: 'Confirmez le virement de masse',
  html: ` <p><strong>Vous êtes sur le point d'effectuer un virement de masse </p>
    <div style="text-align: left; margin: 10px 0;">
      <p><strong>Nombre de bénéficiaires :</strong> ${this.virementForm.value.beneficiaires.length}</p>
      <p><strong>Motif de virement :</strong> ${this.virementForm.value.motif}</p>



 <p><strong>Montant :</strong> ${this.formatTND(montant)} </p>
      <p><strong>Frais appliqués :</strong> ${this.formatTND(frais)} </p>
      <p><strong>Total à débiter :</strong> ${this.formatTND(totalAvecTVA)} </p>





    </div>
    <div style="font-size: 12px; color: #666; margin-top: 15px; border-top: 1px solid #eee; padding-top: 10px;">
      <p><i class="fas fa-shield-alt" style="color: #3366cc; margin-right: 5px;"></i> Un code OTP vous sera envoyé par SMS pour valider cette opération.</p>
      <p><i class="fas fa-exchange-alt" style="color: #3366cc; margin-right: 5px;"></i> En confirmant, vous autorisez le débit immédiat de votre compte.</p>
    </div>
  `,
  icon: 'question',
  showCancelButton: true,
  confirmButtonColor: '#3366cc',
  cancelButtonColor: '#6c757d',
  confirmButtonText: 'Confirmer',
  cancelButtonText: 'Annuler',
  focusCancel: true,
  customClass: {
    container: 'swal-bank-container',
    popup: 'swal-bank-popup',
    title: 'swal-bank-title',
    htmlContainer: 'swal-bank-html',
    confirmButton: 'swal-bank-confirm-btn',
    cancelButton: 'swal-bank-cancel-btn'
  }
}).then((result) => {
  if (result.isConfirmed) {
    this.sendOtpRequest();
  } else {
    this.isProcessing = false;
  }
});}
 private sendOtpRequest(): void {
    this.isProcessing = true;

    // Préparation des données dans le format attendu par l'API
    const formData = {
      ribEmetteur: this.virementForm.value.ribEmetteur,
      motif: this.virementForm.value.motif,
      description: this.virementForm.value.description,
      beneficiaires: this.virementForm.value.beneficiaires.map((b: any) => ({
        idBeneficiaire: Number(b.idBeneficiaire),
        montant: Number(b.montant)
      })),
      otp: ""
    };

    console.log('Envoi des données au backend:', formData);

    this.virementService.uploadVirementMasseForm(formData).subscribe({
      next: (response: any) => {
        this.isProcessing = false;
        this.otpRequested = true;
        this.showOtpField = true;
        Swal.fire('Code envoyé', response.message || 'Un code OTP a été envoyé à votre mobile', 'success');
      },
      error: (error) => {
        this.isProcessing = false;
        console.error('Erreur détaillée:', error);
        Swal.fire('Erreur', error.error?.message || 'Échec de l\'envoi du code OTP', 'error');
      }
    });
}

private processVirement(): void {
    if (!this.virementForm.get('otp')?.valid) {
      Swal.fire('Erreur', 'Veuillez saisir le code OTP reçu par SMS', 'error');
      return;
    }

    this.isProcessing = true;

    // Préparation des données dans le format attendu par l'API
    const formData = {
      ribEmetteur: this.virementForm.value.ribEmetteur,
      motif: this.virementForm.value.motif,
      description: this.virementForm.value.description,
      beneficiaires: this.virementForm.value.beneficiaires.map((b: any) => ({
        idBeneficiaire: Number(b.idBeneficiaire),
        montant: Number(b.montant)
      })),
      otp: this.virementForm.value.otp
    };

    console.log('Envoi des données OTP au backend:', formData);

    this.virementService.uploadVirementMasseForm(formData).subscribe({
      next: (response: any) => {
        this.isProcessing = false;
        Swal.fire({
          title: 'Virement effectué',
          html: `Virement de masse réussi !<br>
                 ${response.message || ''}<br>
                 ${response.reference ? 'Référence: ' + response.reference : ''}<br>
                 ${response.montantTotal ? 'Montant total: ' + response.montantTotal.toFixed(2) + ' TND' : ''}`,
          icon: 'success'
        });
        this.resetForm();
      },
      error: (error) => {
        this.isProcessing = false;
        console.error('Erreur détaillée:', error);
        if (error.status === 400 && error.error.requiresOtp) {
          Swal.fire('Erreur', error.error?.message || 'Code OTP incorrect ou expiré', 'error');
        } else {
          Swal.fire('Erreur', error.error?.message || 'Erreur lors du traitement du virement', 'error');
        }
      }
    });
}


  private resetForm(): void {
    this.virementForm.reset();
    this.showOtpField = false;
    this.otpRequested = false;
    this.beneficiairesFormArray.clear();
    this.ajouterBeneficiaire();
  }

  openAddBeneficiaireModal(): void {
    const modalRef = this.modalService.open(AddBeneficiaireComponent, { size: 'lg', centered: true });

    modalRef.result.then(
      (result) => {
        if (result === 'success') {
          this.chargerBeneficiaires();
          Swal.fire('Succès', 'Bénéficiaire ajouté avec succès!', 'success');
        }
      },
      () => console.log('Modal fermé sans ajout')
    );
  }
}
