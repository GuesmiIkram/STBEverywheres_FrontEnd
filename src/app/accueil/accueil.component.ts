import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from "@angular/core";
import * as L from "leaflet";
import { ChatbotService } from "../services/ChatbotService";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-accueil",
  templateUrl: "./accueil.component.html",
  styleUrls: ["./accueil.component.scss"],
})
export class AccueilComponent implements OnInit, AfterViewInit {
  @ViewChild("authSection") authSection!: ElementRef;
  expandedService: string | null = null;
  epargneMontant = 1000;
  epargneDuree = 3;
  epargneResultat: number | null = null;
  montant = 50000;
  duree = 36;
  taux = 7;
  typeAmortissement = "constant";
  result: any = null;
  details: any[] = [];
  showSimulator = false;
  showChatbot = false;
  showMap = false;
  private map!: L.Map;
  private markersLayer!: L.LayerGroup;
  filteredAgences: any[] = [];
  selectedAgence: any = null;
  messages: { text: string, sender: 'user' | 'bot' }[] = [];
  newMessage = '';
  selectedService: string | null = null;
  isLoadingAgences = false;
  mapInitialized = false;

  agences: any[] = [];

  private defaultAgences = [
    {
      name: "STB Tunis Centre",
      lat: 36.8008,
      lng: 10.1803,
      address: "Avenue Habib Bourguiba, Tunis",
      shortAddress: "Avenue Habib Bourguiba",
      phone: "+216 71 340 477",
      hours: "Lun-Ven: 8h-16h, Sam: 8h-12h",
    },
    {
      name: "STB Lafayette",
      lat: 36.8114,
      lng: 10.1849,
      address: "Rue de Marseille, Tunis",
      shortAddress: "Rue de Marseille",
      phone: "+216 71 783 140",
      hours: "Lun-Ven: 8h-16h, Sam: 8h-12h",
    },
    {
      name: "STB El Menzah",
      lat: 36.8381,
      lng: 10.1651,
      address: "Avenue de la Liberté, El Menzah",
      shortAddress: "Avenue de la Liberté",
      phone: "+216 71 238 680",
      hours: "Lun-Ven: 8h-16h, Sam: 8h-12h",
    },
    {
      name: "STB Lac",
      lat: 36.8389,
      lng: 10.2417,
      address: "Les Berges du Lac, Tunis",
      shortAddress: "Les Berges du Lac",
      phone: "+216 71 861 861",
      hours: "Lun-Ven: 8h-16h, Sam: 8h-12h",
    },
    {
      name: "STB Ariana",
      lat: 36.8625,
      lng: 10.1956,
      address: "Avenue de la République, Ariana",
      shortAddress: "Avenue de la République",
      phone: "+216 71 709 900",
      hours: "Lun-Ven: 8h-16h, Sam: 8h-12h",
    },
  ];

  constructor(
    private chatbotService: ChatbotService,
    private http: HttpClient
  ) {
    this.filteredAgences = [...this.defaultAgences];
  }

  ngOnInit(): void {
    this.preloadLeafletResources();
    this.loadAgences();
  }

  ngAfterViewInit(): void {
    if (this.showMap) {
      setTimeout(() => {
        if (this.agences.length > 0) {
          this.initMap();
        }
      }, 500);
    }
  }

  private safeParseCoordinate(coord: any): number {
    if (coord === null || coord === undefined) return 0;
    
    const str = coord.toString().trim();
    const normalized = str.replace(',', '.');
    const cleaned = normalized.replace(/[^\d.-]/g, '');
    const num = parseFloat(cleaned);
    
    return isNaN(num) ? 0 : num;
  }

  loadAgences(): void {
    this.isLoadingAgences = true;
    this.http.get<any[]>('http://localhost:5036/api/AgenceApi').subscribe({
      next: (agences) => {
        this.agences = agences.map(agence => {
          const lat = this.safeParseCoordinate(agence.latitude);
          const lng = this.safeParseCoordinate(agence.longitude);
          
          return {
            name: agence.libelle,
            lat: lat,
            lng: lng,
            address: agence.addresse,
            shortAddress: agence.addresse.split('-')[0]?.trim() || agence.addresse,
            phone: agence.tel1,
            hours: "Lun-Ven: 8h-16h, Sam: 8h-12h",
            originalData: agence
          };
        }).filter(agence => agence.lat !== 0 && agence.lng !== 0);

        this.filteredAgences = [...this.agences];
        this.isLoadingAgences = false;
        
        if (this.showMap) {
          if (this.mapInitialized) {
            this.updateMapMarkers();
          } else {
            this.initMap();
            this.mapInitialized = true;
          }
        }
      },
      error: (err) => {
        console.error('Erreur API agences:', err);
        this.useDefaultAgences();
      }
    });
  }

  private updateMapMarkers(): void {
    if (!this.map || !this.markersLayer) return;
    
    this.markersLayer.clearLayers();
    
    this.agences.forEach(agence => {
      this.addMarkerToMap(agence);
    });

    if (this.agences.length > 0) {
      const bounds = L.latLngBounds(this.agences.map(a => [a.lat, a.lng]));
      this.map.fitBounds(bounds, { padding: [50, 50] });
    }
  }

  private addMarkerToMap(agence: any): void {
    const customIcon = L.divIcon({
      className: "custom-div-icon",
      html: `<div class="marker-pin"></div>`,
      iconSize: [30, 42],
      iconAnchor: [15, 42],
      popupAnchor: [0, -35],
    });

    const marker = L.marker([agence.lat, agence.lng], { icon: customIcon })
      .addTo(this.markersLayer)
      .bindPopup(`
        <div class="custom-popup">
          <h3>${agence.name}</h3>
          <p><i class="fas fa-map-marker-alt"></i> ${agence.address}</p>
          <p><i class="fas fa-phone"></i> ${agence.phone}</p>
          <p><i class="fas fa-clock"></i> ${agence.hours}</p>
        </div>
      `);

    marker.on("click", () => {
      this.selectedAgence = agence;
    });
  }

  private useDefaultAgences(): void {
    console.warn("Utilisation des agences par défaut");
    this.agences = [...this.defaultAgences];
    this.filteredAgences = [...this.agences];
    this.isLoadingAgences = false;
    
    if (this.showMap) {
      if (this.mapInitialized) {
        this.updateMapMarkers();
      } else {
        this.initMap();
        this.mapInitialized = true;
      }
    }
  }

  private initMap(): void {
    console.log("Initialisation de la carte avec", this.agences.length, "agences");
    
    const mapElement = document.getElementById("map");
    if (!mapElement) {
      console.error("Élément map non trouvé");
      return;
    }

    mapElement.style.height = "500px";
    mapElement.style.width = "100%";

    if (this.map) {
      this.map.remove();
    }

    try {
      this.map = L.map("map", {
        center: [36.8065, 10.1815],
        zoom: 13,
        zoomControl: true,
        attributionControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);

      this.markersLayer = L.layerGroup().addTo(this.map);
      this.updateMapMarkers();
      this.forceMapResize();
      
      console.log("Carte initialisée avec succès");
    } catch (error) {
      console.error("Erreur d'initialisation de la carte:", error);
      this.useIframeMap();
    }
  }

  private useIframeMap(): void {
    const mapElement = document.getElementById("map");
    if (!mapElement) return;

    const validAgences = this.agences.filter(a => !isNaN(a.lat) && !isNaN(a.lng));
    const lats = validAgences.map(a => a.lat);
    const lngs = validAgences.map(a => a.lng);
    
    const centerLat = lats.length > 0 ? lats.reduce((a, b) => a + b, 0) / lats.length : 36.8065;
    const centerLng = lngs.length > 0 ? lngs.reduce((a, b) => a + b, 0) / lngs.length : 10.1815;

    mapElement.innerHTML = `
      <iframe 
        width="100%" 
        height="100%" 
        frameborder="0" 
        scrolling="no" 
        marginheight="0" 
        marginwidth="0" 
        src="https://www.openstreetmap.org/export/embed.html?bbox=${centerLng - 0.05}%2C${centerLat - 0.05}%2C${centerLng + 0.05}%2C${centerLat + 0.05}&amp;layer=mapnik&amp;marker=${centerLat}%2C${centerLng}" 
        style="border: 1px solid #ccc">
      </iframe>
    `;
  }

  private preloadLeafletResources(): void {
    const preloadTiles = () => {
      const img1 = new Image();
      img1.crossOrigin = "Anonymous";
      img1.src = "https://tile.openstreetmap.org/10/512/384.png";

      const img2 = new Image();
      img2.crossOrigin = "Anonymous";
      img2.src = "https://tile.openstreetmap.org/10/512/385.png";
    };

    setTimeout(preloadTiles, 100);
  }

  private forceMapResize(): void {
    if (!this.map) return;

    setTimeout(() => {
      this.map.invalidateSize(true);
    }, 0);
    
    setTimeout(() => {
      if (this.map) this.map.invalidateSize(true);
    }, 300);
  }

  // ... (les autres méthodes restent inchangées)
  toggleblock() {
    this.showChatbot = !this.showChatbot;
  }

  toggleBlock(block: string): void {
    this.showSimulator = block === "simulator";
    this.showChatbot = block === "chatbot";

    if (block === "map") {
      this.showMap = true;
      setTimeout(() => {
        if (this.agences.length > 0) {
          this.initMap();
        }
      }, 500);
    } else {
      this.showMap = false;
    }
  }

  focusOnAgence(agence: any): void {
    if (!this.map) return;

    this.map.setView([agence.lat, agence.lng], 15);
    this.selectedAgence = agence;

    this.markersLayer.eachLayer((layer: any) => {
      const layerLatLng = layer.getLatLng();
      if (layerLatLng.lat === agence.lat && layerLatLng.lng === agence.lng) {
        layer.openPopup();
      }
    });
  }

  searchAgences(event: any): void {
    const searchTerm = event.target.value.toLowerCase();

    this.filteredAgences = this.agences.filter(
      (agence) => agence.name.toLowerCase().includes(searchTerm) || 
                 agence.address.toLowerCase().includes(searchTerm),
    );

    if (this.markersLayer) {
      this.markersLayer.eachLayer((layer: any) => {
        const layerLatLng = layer.getLatLng();
        const matchingAgence = this.filteredAgences.find(
          (agence) => agence.lat === layerLatLng.lat && agence.lng === layerLatLng.lng,
        );

        if (matchingAgence) {
          layer.setOpacity(1);
        } else {
          layer.setOpacity(0.3);
        }
      });
    }
  }

  showDetails(service: string): void {
    this.selectedService = service;
  }
  
  closeDetails(): void {
    this.selectedService = null;
  }

  calculerCredit() {
    const tauxMensuel = this.taux / 12 / 100;
    const nombreMensualites = this.duree;

    if (this.typeAmortissement === "constant") {
      const mensualite = (this.montant * tauxMensuel) / (1 - Math.pow(1 + tauxMensuel, -nombreMensualites));
      this.result = { type: "Mensualité constante", mensualite: mensualite.toFixed(2) };
    } else if (this.typeAmortissement === "variable") {
      const capitalFixe = this.montant / nombreMensualites;
      let capitalRestant = this.montant;
      this.details = [];

      for (let i = 1; i <= nombreMensualites; i++) {
        const interet = capitalRestant * tauxMensuel;
        const mensualite = capitalFixe + interet;
        this.details.push({
          mois: i,
          mensualite: mensualite.toFixed(2),
          interet: interet.toFixed(2),
          capitalRestant: capitalRestant.toFixed(2),
        });
        capitalRestant -= capitalFixe;
      }
      this.result = { type: "Amortissement variable", details: this.details };
    }
  }

  toggleService(service: string) {
    this.expandedService = this.expandedService === service ? null : service;
  }

  isExpanded(service: string): boolean {
    return this.expandedService === service;
  }

  calculerEpargne() {
    const taux = 0.03;
    this.epargneResultat = this.epargneMontant * Math.pow(1 + taux, this.epargneDuree);
  }

  scrollToAuth(tab: "login" | "register"): void {
    this.authSection.nativeElement.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => {
      const authComponent = this.authSection.nativeElement.querySelector("app-auth");
      if (authComponent) {
        authComponent.activeTab = tab;
      }
    }, 500);
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    this.messages.push({ text: this.newMessage, sender: 'user' });
    const userMessage = this.newMessage;
    this.newMessage = '';

    this.chatbotService.sendMessage(userMessage).subscribe(
      (response: any) => {
        this.messages.push({ text: response.reply, sender: 'bot' });
      },
      (error) => {
        console.error('Erreur du chatbot:', error);
        this.messages.push({ 
          text: "Désolé, je rencontre un problème technique. Veuillez réessayer plus tard.", 
          sender: 'bot' 
        });
      }
    );
  }
}