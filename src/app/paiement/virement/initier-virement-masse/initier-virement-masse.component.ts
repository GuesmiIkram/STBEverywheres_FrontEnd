import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Compte } from 'src/app/Models/compte';
import { VirementService } from 'src/app/services/virement.service';

@Component({
  selector: 'app-initier-virement-masse',
  templateUrl: './initier-virement-masse.component.html',
  styleUrls: ['./initier-virement-masse.component.scss']
})
export class InitierVirementMasseComponent implements OnInit {


  virementForm: FormGroup;
  fichier: File | null = null;

  constructor(private fb: FormBuilder, private virementService: VirementService) {
    this.virementForm = this.fb.group({
      fichier: [null, Validators.required], // Déclaration du champ de fichier
    });
  }

  ngOnInit(): void {}

  // Fonction pour gérer le changement de fichier
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.fichier = file;
    }
  }

  // Fonction pour envoyer le fichier au serveur
  onSubmit(): void {
    if (this.virementForm.invalid || !this.fichier) {
      console.log('Le formulaire est invalide ou le fichier n\'a pas été sélectionné.');
      return;
    }

    const formData = new FormData();
    formData.append('Fichier', this.fichier, this.fichier.name);

    this.virementService.uploadVirementMasse(formData).subscribe(
      (response: any) => {
        console.log('Virement en masse effectué avec succès !', response);
        alert('Virement en masse effectué avec succès');
      },
      (error) => {
        console.error('Erreur lors du virement en masse :', error);
        alert('Erreur lors du virement en masse');
      }
    );
  }



}
