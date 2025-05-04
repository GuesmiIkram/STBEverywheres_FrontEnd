import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CarteService } from './carte.service';
import { CarteDTO } from '../Models/CarteDTO';
import { NomCarte } from '../enums/nom-carte.enum';
import { TypeCarte } from '../enums/type-carte.enum';
import { StatutCarte } from '../enums/statut-carte.enum';

describe('CarteService', () => {
  let service: CarteService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:5000/api/carte';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CarteService,
        { provide: 'environnement', useValue: { apiurl: 'http://localhost:5000/api' } }
      ]
    });

    service = TestBed.inject(CarteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCartesByClientId', () => {
    it('should return cartes with enum values mapped', () => {
      const mockCartes = [
        {
          id: 1,
          nomCarte: 'VisaClassic',
          typeCarte: 'International',
          statut: 'Active'
        },
        {
          id: 2,
          nomCarte: 'Mastercard',
          typeCarte: 'National',
          statut: 'Blocked'
        }
      ];

      service.getCartesByClientId().subscribe(cartes => {
        expect(cartes.length).toBe(2);
        expect(cartes[0].nomCarte).toEqual(NomCarte.VisaClassic);
        expect(cartes[0].typeCarte).toEqual(TypeCarte.International);
        expect(cartes[0].statut).toEqual(StatutCarte.Active);
        expect(cartes[1].nomCarte).toEqual(NomCarte.Mastercard);
        expect(cartes[1].typeCarte).toEqual(TypeCarte.National);
        expect(cartes[1].statut).toEqual(StatutCarte.Blocked);
      });

      const req = httpMock.expectOne(`${apiUrl}/cartes/by-client`);
      expect(req.request.method).toBe('GET');
      req.flush(mockCartes);
    });
  });

  describe('getCarteDetails', () => {
    it('should return carte details', () => {
      const mockCarte: CarteDTO = {
        numCarte: '1234567890123456',
        nomCarte: NomCarte.VisaClassic,
        typeCarte: TypeCarte.International,
        statut: StatutCarte.Active,
        plafondTPE: 1000,
        solde: 500,
        dateCreation: new Date(),
        dateExpiration: new Date(),
        iddemande: 1,
        rib: 'RIB123',
        codePIN: '1234',
        codeCVV: '123',
        plafondDAP: 1000
      };

      service.getCarteDetails('1234567890123456').subscribe(carte => {
        expect(carte).toEqual(mockCarte);
      });

      const req = httpMock.expectOne(`${apiUrl}/details/1234567890123456`);
      expect(req.request.method).toBe('GET');
      req.flush(mockCarte);
    });
  });

  describe('blockCarte', () => {
    it('should send POST request to block carte', () => {
      service.blockCarte('1234567890123456').subscribe(response => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(`${apiUrl}/block/1234567890123456`);
      expect(req.request.method).toBe('POST');
      req.flush({ success: true });
    });
  });

  describe('deblockCarte', () => {
    it('should send POST request to deblock carte', () => {
      service.deblockCarte('1234567890123456').subscribe(response => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(`${apiUrl}/deblock/1234567890123456`);
      expect(req.request.method).toBe('POST');
      req.flush({ success: true });
    });
  });
});