import { Component } from "@angular/core"
import { DemandeChequierService } from "src/app/services/DemandeChequier.service"

import { FormBuilder, FormGroup, Validators } from "@angular/forms"

@Component({
  selector: 'app-demande-chequier',
  templateUrl: './demande-chequier.component.html',
  styleUrls: ['./demande-chequier.component.scss']
})
export class DemandeChequierComponent {
  demandeForm: FormGroup
  comptes: any[] = []
  showNonBarreFields = false
  showEngagementText = false
  showEnvoiRecommandeFields = false

  constructor(
    private fb: FormBuilder,
    private chequierService: DemandeChequierService,
  ) {
    this.demandeForm = this.initForm()
    this.loadComptes()
  }

  initForm(): FormGroup {
    const formGroup = this.fb.group({
      ribCompte: ["", Validators.required],
      nombreFeuilles: [25, [Validators.required, Validators.min(5), Validators.max(50)]],
      plafondChequier: ["", [Validators.required, Validators.max(30000)]],
      avecOtp: [false],
      modeLivraison: ["", Validators.required],
      adresseComplete: [""],
      codePostal: [""],
      email: ["", [Validators.required, Validators.email]],
      numTel: ["", Validators.required],
      typeChequier: ["barre", Validators.required],
      raisonDemande: [""],
      accepteEngagement: [false],
    })

    // Gestion des changements dynamiques
    formGroup.get("typeChequier")?.valueChanges.subscribe((val) => {
      this.showNonBarreFields = val === "nonBarre"
      if (val === "barre") {
        formGroup.get("raisonDemande")?.reset()
        formGroup.get("accepteEngagement")?.reset()
        this.showEngagementText = false
      }
    })

    formGroup.get("modeLivraison")?.valueChanges.subscribe((val) => {
      this.showEnvoiRecommandeFields = val === "EnvoiRecommande"

      if (val !== "EnvoiRecommande") {
        formGroup.get("adresseComplete")?.reset()
        formGroup.get("codePostal")?.reset()
      }
    })

    return formGroup
  }

  loadComptes() {
    this.chequierService.getComptesClient().subscribe(
      (data) => (this.comptes = data),
      (error) => console.error("Erreur lors du chargement des comptes", error),
    )
  }

  onSubmit() {
    if (this.demandeForm.invalid) {
      this.markAllAsTouched()
      return
    }

    const formValue = this.demandeForm.value

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
    }

    // Champs conditionnels pour livraison
    if (formValue.modeLivraison === "EnvoiRecommande") {
      demandeData.AdresseComplete = formValue.adresseComplete
      demandeData.CodePostal = formValue.codePostal
    }

    console.log("Données envoyées:", demandeData)

    const request$ =
      formValue.typeChequier === "barre"
        ? this.chequierService.demanderChequierBarre(demandeData)
        : this.chequierService.demanderChequierNonBarre(demandeData)

    request$.subscribe({
      next: () => {
        this.showSuccessNotification("Demande enregistrée avec succès!")
        this.resetForm()
      },
      error: (error) => {
        console.error("Erreur:", error)
        this.handleError(error)
      },
    })
  }

  showSuccessNotification(message: string) {
    // Vous pouvez remplacer ceci par votre propre système de notification
    const notification = document.createElement("div")
    notification.className = "success-notification"
    notification.innerHTML = `
      <div class="notification-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      </div>
      <div class="notification-message">${message}</div>
    `
    document.body.appendChild(notification)

    setTimeout(() => {
      notification.classList.add("show")
      setTimeout(() => {
        notification.classList.remove("show")
        setTimeout(() => {
          document.body.removeChild(notification)
        }, 300)
      }, 3000)
    }, 100)
  }

  private markAllAsTouched() {
    Object.values(this.demandeForm.controls).forEach((control) => {
      control.markAsTouched()
    })
  }

  private resetForm() {
    this.demandeForm.reset({
      typeChequier: "barre",
      nombreFeuilles: 25,
      avecOtp: false,
    })
    this.showNonBarreFields = false
    this.showEngagementText = false
    this.showEnvoiRecommandeFields = false
  }

  private handleError(error: any) {
    let errorMessage = "Une erreur est survenue"

    if (error.error?.errors) {
      errorMessage = Object.entries(error.error.errors)
        .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : value}`)
        .join("\n")
    } else if (error.error) {
      errorMessage = typeof error.error === "string" ? error.error : error.error.message
    }

    // Afficher l'erreur dans une notification stylisée
    const notification = document.createElement("div")
    notification.className = "error-notification"
    notification.innerHTML = `
      <div class="notification-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <div class="notification-message">${errorMessage}</div>
    `
    document.body.appendChild(notification)

    setTimeout(() => {
      notification.classList.add("show")
      setTimeout(() => {
        notification.classList.remove("show")
        setTimeout(() => {
          document.body.removeChild(notification)
        }, 300)
      }, 5000)
    }, 100)
  }

  showEngagement() {
    this.showEngagementText = !this.showEngagementText
  }
}
