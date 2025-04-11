import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RepondreDemandeDecouvertService } from '../../services/RepondreDemandeDecouvert.service';

@Component({
  selector: 'app-demande-decouvert',
  templateUrl: './demande-decouvert.component.html',
  styleUrls: ['./demande-decouvert.component.scss']
})
export class DemandeDecouvertComponent implements OnInit {
  responseForm: FormGroup;
  demands: any[] = [];
  selectedDemandId: string | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private demandeService: RepondreDemandeDecouvertService
  ) {
    this.responseForm = this.fb.group({
      accepte: [false, Validators.required],
      motifRefus: ['']
    });

    this.responseForm.get('accepte')?.valueChanges.subscribe(accepte => {
      const motifRefusControl = this.responseForm.get('motifRefus');
      if (!accepte) {
        motifRefusControl?.setValidators([Validators.required]);
      } else {
        motifRefusControl?.clearValidators();
        motifRefusControl?.setValue('');
      }
      motifRefusControl?.updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    this.loadPendingDemands();
  }

  loadPendingDemands(): void {
    this.isLoading = true;
    this.demandeService.getPendingDemands().subscribe({
      next: (data) => {
        console.log("Données reçues du backend :", data);

        this.demands = data.map(d => ({
          id: d.id,
          dateDemande: d.dateDemande,
          ribCompte: d.ribCompte,
          numCin: d.compte?.numCin || 'N/A',  // On récupère numCin depuis compte
          montant: d.decouvertDemande
        }));

        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Échec du chargement des demandes';
        this.isLoading = false;
        console.error(err);
      }
    });
  }



  selectDemand(demandId: string): void {
    this.selectedDemandId = demandId;
    this.responseForm.reset({ accepte: false });
  }

  submitResponse(): void {
    if (!this.selectedDemandId || this.responseForm.invalid) {
      this.responseForm.markAllAsTouched();
      return;
    }

    const response = {
      idDemande: this.selectedDemandId,
      accepte: this.responseForm.value.accepte,
      motifRefus: this.responseForm.value.motifRefus || null

    };

    this.isLoading = true;
    console.log("reponse envoyé au back",response)
    this.demandeService.respondToDemand(response).subscribe({
      next: () => {
        this.loadPendingDemands();
        this.selectedDemandId = null;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Échec de l\'envoi de la réponse';
        this.isLoading = false;
        console.error(err);
      }
    });
  }
}
