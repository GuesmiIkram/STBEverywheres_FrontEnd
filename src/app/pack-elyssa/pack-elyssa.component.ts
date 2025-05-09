import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ClientService } from '../services/client.service';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import * as L from 'leaflet';

@Component({
  selector: 'app-pack-elyssa',
  templateUrl: './pack-elyssa.component.html',
  styleUrls: ['./pack-elyssa.component.scss']
})
export class PackElyssaComponent implements AfterViewInit {
  selectedFiles: (File | null)[] = Array(6).fill(null);
  selectedAgency: string = '';
  isSubmitting: boolean = false;
  private map!: L.Map;
  private markersLayer!: L.LayerGroup;

  // Liste des agences avec leurs coordonnées
  agencies = [
    {
      name: "Agence Paris Centre",
      lat: 48.866667,
      lng: 2.333333,
      address: "10 Rue de la Paix, 75002 Paris",
      phone: "+33 1 40 20 50 00"
    },
    {
      name: "Agence Lyon Part-Dieu",
      lat: 45.764043,
      lng: 4.835659,
      address: "20 Rue de la République, 69003 Lyon",
      phone: "+33 4 72 40 50 00"
    },
    {
      name: "Agence Toulouse Capitole",
      lat: 43.604652,
      lng: 1.444209,
      address: "5 Place du Capitole, 31000 Toulouse",
      phone: "+33 5 34 45 50 00"
    }
  ];

  @ViewChild('mapContainer') mapContainer!: ElementRef;

  constructor(private clientService: ClientService) {}

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    if (!this.mapContainer) return;

    // Création de la carte
    this.map = L.map(this.mapContainer.nativeElement, {
      center: [46.2276, 2.2137], // Centre sur la France
      zoom: 6,
      zoomControl: true,
      attributionControl: true
    });

    // Ajout des tuiles OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Couche pour les marqueurs
    this.markersLayer = L.layerGroup().addTo(this.map);

    // Ajout des marqueurs pour chaque agence
    this.addAgencyMarkers();

    // Centrer la carte sur toutes les agences
    if (this.agencies.length > 0) {
      const bounds = L.latLngBounds(
        this.agencies.map(ag => [ag.lat, ag.lng])
      );
      this.map.fitBounds(bounds, { padding: [50, 50] });
    }
  }

  private addAgencyMarkers(): void {
    this.markersLayer.clearLayers();

    this.agencies.forEach(agency => {
      const marker = L.marker([agency.lat, agency.lng], {
        icon: L.divIcon({
          className: 'custom-marker',
          html: `<div class="marker-pin"></div>`,
          iconSize: [30, 42],
          iconAnchor: [15, 42],
          popupAnchor: [0, -35]
        })
      })
      .addTo(this.markersLayer)
      .bindPopup(`
        <div class="agency-popup">
          <h3>${agency.name}</h3>
          <p><i class="fas fa-map-marker-alt"></i> ${agency.address}</p>
          <p><i class="fas fa-phone"></i> ${agency.phone}</p>
        </div>
      `);

      // Mettre en évidence si c'est l'agence sélectionnée
      if (agency.name === this.selectedAgency) {
        marker.openPopup();
        this.map.setView([agency.lat, agency.lng], 13);
      }
    });
  }

  onAgencyChange(): void {
    if (!this.map) return;
    
    // Trouver l'agence sélectionnée
    const selected = this.agencies.find(a => a.name === this.selectedAgency);
    if (selected) {
      this.map.setView([selected.lat, selected.lng], 13);
      this.addAgencyMarkers(); // Rafraîchir les marqueurs pour mettre en évidence
    }
  }

  onFileSelected(event: any, index: number): void {
    const file = event.target.files[0];
    this.selectedFiles[index] = file || null;
  }

  async submitDocuments(form: NgForm): Promise<void> {
    if (this.isSubmitting) return;
    
    this.isSubmitting = true;

    // Vérification des champs obligatoires
    if (!this.selectedAgency) {
      await Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Veuillez sélectionner une agence',
        confirmButtonColor: '#3085d6',
      });
      this.isSubmitting = false;
      return;
    }

    // Vérification des documents obligatoires (indices 0, 3, 4, 5)
    const requiredDocuments = [0, 3, 4, 5];
    for (const index of requiredDocuments) {
      if (!this.selectedFiles[index]) {
        await Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: `Veuillez joindre le document obligatoire ${index + 1}`,
          confirmButtonColor: '#3085d6',
        });
        this.isSubmitting = false;
        return;
      }
    }

    const formData = new FormData();
    
    // Ajout des fichiers
    this.selectedFiles.forEach((file, index) => {
      if (file) {
        formData.append(`document${index + 1}`, file, file.name);
      }
    });

    // Ajout de l'agence
    formData.append('agency', this.selectedAgency);

    // Envoi au backend
    this.clientService.uploadElyssaDocuments(formData).subscribe({
      next: async (response) => {
        await Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: response.message || 'Documents envoyés avec succès!',
          confirmButtonColor: '#3085d6',
        });
        form.resetForm();
        this.selectedFiles = Array(6).fill(null);
        this.selectedAgency = '';
        this.isSubmitting = false;
      },
      error: async (err) => {
        console.error('Erreur lors de l\'envoi', err);
        
        if (err.error === "Vous avez déjà une demande en cours. Vous ne pouvez pas soumettre une nouvelle demande tant que la précédente n'est pas traitée.") {
          await Swal.fire({
            icon: 'warning',
            title: 'Demande existante',
            text: err.error,
            confirmButtonColor: '#3085d6',
          });
        } else {
          await Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: err.error?.message || err.error || 'Erreur lors de l\'envoi des documents',
            confirmButtonColor: '#3085d6',
          });
        }
        
        this.isSubmitting = false;
      }
    });
  }

  triggerFileInput(id: string): void {
    const element = document.getElementById(id) as HTMLInputElement;
    if (element) element.click();
  }

  // Méthode pour forcer le redimensionnement de la carte
  private forceMapResize(): void {
    if (!this.map) return;

    setTimeout(() => {
      this.map.invalidateSize(true);
    }, 0);
    
    setTimeout(() => {
      if (this.map) this.map.invalidateSize(true);
    }, 300);
  }
}