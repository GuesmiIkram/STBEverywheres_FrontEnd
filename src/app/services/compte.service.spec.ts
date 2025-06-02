import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CompteService } from './compte.service';
import { Compte } from '../Models/compte';

import { environnement } from '../environnement/environnement';
import { Client } from '../Models/Client';

describe('CompteService', () => {
  let service: CompteService;
  let httpMock: HttpTestingController;
  const apiUrl = environnement.apiurl + '/compte';

  const mockClient: Client = {
    id: 1,
    nom: 'Ben Ammar',
    prenom: 'Mohamed',
    dateNaissance: new Date('1985-05-15'),
    telephone: '92123456',
    email: 'mohamed.benammar@example.tn',
    adresse: '15 Rue Habib Bourguiba, Tunis',
    civilite: 'M',
    nationalite: 'Tunisienne',
    etatCivil: 'Marié',
    residence: 'Tunisie',
    numCIN: '12345678',
    dateDelivranceCIN: new Date('2018-06-20'),
    dateExpirationCIN: new Date('2028-06-20'),
    lieuDelivranceCIN: 'Tunis',
    photoClient: 'photo.jpg',
    genre: 'Masculin',
    profession: 'Ingénieur Informatique',
    situationProfessionnelle: 'Cadre',
    niveauEducation: 'Master',
    nombreEnfants: 2,
    revenuMensuel: 3500,
    paysNaissance: 'Tunisie',
    nomMere: 'Amina Ben Ali',
    nomPere: 'Ali Ben Ammar',
    id_convention: 1
  };

  const mockCompte: Compte = {
    rib: 'TN5912345678901234567890',
    iban: 'TN59 1234 5678 9012 3456 7890',
    numCin: '12345678',
    client: mockClient,
    type: 'Courant',
    solde: 5000,
    decouvertAutorise: 1000,
    dateCreation: '2023-01-01T00:00:00.000Z',
    statut: 'Actif',
    montantMaxAutoriseParJour: 2000,
    nbrOperationsAutoriseesParJour: '5'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CompteService]
    });

    service = TestBed.inject(CompteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getComptesByCin', () => {
    it('should return accounts array with client data', () => {
      service.getComptesByCin().subscribe(comptes => {
        expect(comptes.length).toBe(1);
        expect(comptes[0].rib).toBe(mockCompte.rib);
        expect(comptes[0].client?.nom).toBe('Ben Ammar');
        expect(comptes[0].iban).toBe('TN59 1234 5678 9012 3456 7890');
      });

      const req = httpMock.expectOne(`${apiUrl}/listecompte`);
      req.flush([mockCompte]);
    });
  });

  describe('createCompte', () => {
    it('should send POST request with complete compte data', () => {
      service.createCompte(mockCompte).subscribe(response => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(`${apiUrl}/CreateCompte`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockCompte);
      req.flush({ success: true });
    });
  });

  describe('getCompteByRib', () => {
    it('should return account with all properties', () => {
      service.getCompteByRib(mockCompte.rib).subscribe(compte => {
        expect(compte.iban).toBe(mockCompte.iban);
        expect(compte.client).toBeDefined();
        expect(compte.montantMaxAutoriseParJour).toBe(2000);
      });

      const req = httpMock.expectOne(`${apiUrl}/GetByRIB/${mockCompte.rib}`);
      req.flush(mockCompte);
    });
  });

  describe('cloturerCompte', () => {
    it('should send PUT request to close account', () => {
      const updatedCompte = { ...mockCompte, statut: 'Clôturé' };
      
      service.cloturerCompte(mockCompte.rib).subscribe(response => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(`${apiUrl}/Cloturer/${mockCompte.rib}`);
      expect(req.request.method).toBe('PUT');
      req.flush(updatedCompte);
    });
  });

  describe('downloadRIB', () => {
    it('should download RIB PDF with IBAN information', () => {
      const mockBlob = new Blob(['RIB content'], { type: 'application/pdf' });

      service.downloadRIB(mockCompte.rib).subscribe(data => {
        expect(data instanceof Blob).toBeTrue();
      });

      const req = httpMock.expectOne(`${apiUrl}/rib/download?rib=${mockCompte.rib}`);
      expect(req.request.headers.get('Accept')).toBe('application/pdf');
      req.flush(mockBlob);
    });
  });

  
});