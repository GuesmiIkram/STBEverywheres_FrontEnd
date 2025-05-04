import { Component } from "@angular/core"
import { DemandeChequierService } from "src/app/services/DemandeChequier.service"

import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import Swal from "sweetalert2"

@Component({
  selector: 'app-demande-chequier',
  templateUrl: './demande-chequier.component.html',
  styleUrls: ['./demande-chequier.component.scss']
})
export class DemandeChequierComponent {

  demandeForm: FormGroup;
  comptes: any[] = [];
  showNonBarreFields = false;
  showEngagementText = false;
  showEnvoiRecommandeFields = false;

  constructor(
    private fb: FormBuilder,
    private chequierService: DemandeChequierService,
  ) {
    this.demandeForm = this.initForm();
    this.loadComptes();
  }

  private initForm(): FormGroup {
    const formGroup = this.fb.group({
      ribCompte: ["", Validators.required],
      nombreFeuilles: [25, [Validators.required, Validators.min(5), Validators.max(50)]],
      plafondChequier: ["", [Validators.required, Validators.max(30000)]],

      avecOtp: [false],
      modeLivraison: ["", Validators.required],
      adresseComplete: [""],
      codePostal: [""],
      email: ["", [Validators.required, Validators.email]],
      numTel: ["", [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
      typeChequier: ["barre", Validators.required],
      raisonDemande: [""],
      accepteEngagement: [false],
    });

    // Gestion des changements type de chéquier
    formGroup.get("typeChequier")?.valueChanges.subscribe((val) => {
      this.showNonBarreFields = val === "nonBarre";
      const raisonControl = formGroup.get("raisonDemande");
      const engagementControl = formGroup.get("accepteEngagement");

      if (val === "nonBarre") {
        raisonControl?.setValidators([Validators.required]);
        engagementControl?.setValidators([Validators.requiredTrue]);
      } else {
        raisonControl?.clearValidators();
        engagementControl?.clearValidators();
        raisonControl?.reset();
        engagementControl?.reset();
        this.showEngagementText = false;
      }

      raisonControl?.updateValueAndValidity();
      engagementControl?.updateValueAndValidity();
    });

    // Gestion des changements mode de livraison
    formGroup.get("modeLivraison")?.valueChanges.subscribe((val) => {
      this.showEnvoiRecommandeFields = val === "EnvoiRecommande";
      const adresseControl = formGroup.get("adresseComplete");
      const codePostalControl = formGroup.get("codePostal");

      if (val === "EnvoiRecommande") {
        adresseControl?.setValidators([Validators.required]);
        codePostalControl?.setValidators([
          Validators.required,
          Validators.pattern(/^[0-9]+$/),
          Validators.minLength(4),
          Validators.maxLength(4)
        ]);
      } else {
        adresseControl?.clearValidators();
        codePostalControl?.clearValidators();
        adresseControl?.reset();
        codePostalControl?.reset();
      }

      adresseControl?.updateValueAndValidity();
      codePostalControl?.updateValueAndValidity();
    });

    return formGroup;
  }

  loadComptes() {
    this.chequierService.getComptesClient().subscribe(
      (data) => (this.comptes = data),
      (error) => console.error("Erreur lors du chargement des comptes", error),
    );
  }

  onSubmit() {
    if (this.demandeForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    const formValue = this.demandeForm.value;
    const typeChequier = formValue.typeChequier === "barre" ? "barré" : "non barré";
    const modeLivraison = formValue.modeLivraison === "LivraisonAgence" ? "en agence" : "par envoi recommandé";
    // Calcul des frais
    const fraisChequier = 5.000; // Frais fixe pour chéquier barré
    const fraisEnvoi = formValue.modeLivraison === "EnvoiRecommande" ? 1.200 : 0;
    const totalFrais = fraisChequier + fraisEnvoi;
    Swal.fire({
      title: "Confirmation de demande",
      html: `
        <div style="text-align: left; margin-bottom: 20px;">
          <p><strong>Compte:</strong> ${this.getCompteLabel(formValue.ribCompte)}</p>
          <p><strong>Type de chéquier:</strong> ${typeChequier}</p>
          <p><strong>Nombre de feuilles:</strong> ${formValue.nombreFeuilles}</p>
          <p><strong>Plafond:</strong> ${formValue.plafondChequier} TND</p>
          <p><strong>Mode de livraison:</strong> ${modeLivraison}</p>
           <div style="text-align: left; margin-bottom: 20px;">
<h4 style="color: #2c3e50; margin: 25px 0 15px 0;">Détails des frais :</h4>

        <div style="margin-bottom: 8px;">
          <span style="display: inline-block; width: 200px;">Frais de production du chéquier:</span>
          <span style="float: right;">${fraisChequier.toFixed(3)} TND</span>
        </div>

        ${formValue.modeLivraison === "EnvoiRecommande" ? `
        <div style="margin-bottom: 8px;">
          <span style="display: inline-block; width: 200px;">Frais d'envoi recommandé:</span>
          <span style="float: right;">${fraisEnvoi.toFixed(3)} TND</span>
        </div>
        ` : ''}

        <div style="margin-top: 15px; border-top: 1px solid #eee; padding-top: 10px;">
          <span style="display: inline-block; width: 200px; font-weight: bold;">Total à débiter:</span>
          <span style="float: right; font-weight: bold; color: #e74c3c;">${totalFrais.toFixed(3)} TND</span>
        </div>
      </div>

      <p style="margin-top: 20px; font-size: 14px; color: #7f8c8d;">
        En confirmant, vous autorisez le débit immédiat de votre compte pour les frais indiqués.
      </p>
</div>

        </div>
        <p>Êtes-vous sûr de vouloir soumettre cette demande?</p>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirmer",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        this.submitDemande(formValue);
      }
    });
  }

  getCompteLabel(rib: string): string {
    const compte = this.comptes.find((c) => c.rib === rib);
    return compte ? `${compte.rib} - ${compte.type}` : rib;
  }

  private submitDemande(formValue: any) {
    const demandeData: any = {
      RibCompte: formValue.ribCompte,
      NombreFeuilles: formValue.nombreFeuilles,
      PlafondChequier: formValue.plafondChequier,
      Otp: formValue.avecOtp,
      ModeLivraison: formValue.modeLivraison,
      Email: formValue.email,
      NumTel: formValue.numTel,
      RaisonDemande: formValue.typeChequier === "nonBarre" ? formValue.raisonDemande : "",
      AccepteEngagement: formValue.typeChequier === "nonBarre" ? formValue.accepteEngagement : null,
    };

    if (formValue.modeLivraison === "EnvoiRecommande") {
      demandeData.AdresseComplete = formValue.adresseComplete;
      demandeData.CodePostal = formValue.codePostal;
    }

    const request$ = formValue.typeChequier === "barre"
      ? this.chequierService.demanderChequierBarre(demandeData)
      : this.chequierService.demanderChequierNonBarre(demandeData);

    request$.subscribe({
      next: () => {
        Swal.fire({
          title: "Demande envoyée!",
          text: "Votre demande de chéquier a été soumise avec succès.",
          icon: "success",
          confirmButtonColor: "#3085d6",
        });
        this.resetForm();
      },
      error: (error) => {
        console.error("Erreur:", error);
        this.handleError(error);
      },
    });
  }

  private markAllAsTouched() {
    Object.values(this.demandeForm.controls).forEach((control) => {
      control.markAsTouched();
    });
  }

  private resetForm() {
    this.demandeForm.reset({
      typeChequier: "barre",
      nombreFeuilles: 25,
      avecOtp: false,
    });
    this.showNonBarreFields = false;
    this.showEngagementText = false;
    this.showEnvoiRecommandeFields = false;
  }

  private handleError(error: any) {
    let errorMessage = "Une erreur est survenue";

    if (error.error?.errors) {
      errorMessage = Object.entries(error.error.errors)
        .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : value}`)
        .join("\n");
    } else if (error.error) {
      errorMessage = typeof error.error === "string" ? error.error : error.error.message;
    }

    Swal.fire({
      title: "Erreur",
      text: errorMessage,
      icon: "error",
      confirmButtonColor: "#3085d6",
    });
  }

  showEngagement() {
    this.showEngagementText = !this.showEngagementText;
    if (this.showEngagementText) {
      this.demandeForm.get('accepteEngagement')?.markAsUntouched();
    }
  }

}
