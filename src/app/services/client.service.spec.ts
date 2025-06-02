import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ClientService } from './client.service';
import { Client } from '../Models/Client';
import { AuthService } from './auth.service';

describe('ClientService', () => {
  let service: ClientService;
  let httpMock: HttpTestingController;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  const apiUrl = 'http://localhost:5000/api/client';

  
  const completeMockClient: Client = {
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

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['getAccessToken']);
    authServiceMock.getAccessToken.and.returnValue('fake-token');

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ClientService,
        { provide: AuthService, useValue: authServiceMock },
        { provide: 'environnement', useValue: { apiurl: 'http://test-api.com' } }
      ]
    });

    service = TestBed.inject(ClientService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('downloadKYC', () => {
    it('should download KYC document as a Blob', () => {
      const mockBlob = new Blob(['test content'], { type: 'application/pdf' });

      service.downloadKYC().subscribe(response => {
        expect(response instanceof Blob).toBeTrue();
      });

      const req = httpMock.expectOne(`${apiUrl}/kyc/download`);
      req.flush(mockBlob);
    });
  });

  describe('removeProfileImage', () => {
    it('should send DELETE request to remove profile image', () => {
      service.removeProfileImage(123).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/remove-profile-image`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });

 describe('getClientInfo', () => {
  it('should fetch complete client info', () => {
    service.getClientInfo().subscribe(client => {
      expect(client).toEqual(completeMockClient);
      // Mettre à jour les assertions avec les valeurs tunisiennes
      expect(client.nom).toBe('Ben Ammar');
      expect(client.prenom).toBe('Mohamed');
      expect(client.email).toBe('mohamed.benammar@example.tn');
      expect(client.numCIN).toBe('12345678');
    });

    const req = httpMock.expectOne(`${apiUrl}/me`);
    req.flush(completeMockClient);
  });
    it('should handle error when fetching client info', () => {
      service.getClientInfo().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/me`);
      req.flush(null, { status: 500, statusText: 'Server Error' });
    });
  });

  describe('getClientInfoById', () => {
    it('should fetch complete client info by ID', () => {
      service.getClientInfoById(1).subscribe(client => {
        expect(client).toEqual(completeMockClient);
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      req.flush(completeMockClient);
    });
  });

  describe('updateClientInfo', () => {
    it('should send complete client data for update', () => {
      const updatedClient = { ...completeMockClient, nom: 'Updated' };
      
      service.updateClientInfo(updatedClient).subscribe(client => {
        expect(client.nom).toBe('Updated');
      });

      const req = httpMock.expectOne(`${apiUrl}/update`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedClient);
      req.flush(updatedClient);
    });
  });
});