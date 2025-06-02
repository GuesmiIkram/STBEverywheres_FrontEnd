import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AuthService } from './auth.service';
import { ModificationRequest } from '../Models/ModificationRequest';
import { HttpResponse } from '@angular/common/http';
import { AgentService } from './AgentService ';

describe('AgentService', () => {
  let service: AgentService;
  let httpMock: HttpTestingController;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  const apiUrl = 'http://localhost:5000/api/agent';

  const mockModificationRequests: ModificationRequest[] = [
    {
      id: 1,
      clientId: 123,
      fieldToModify: 'email',
      newValue: 'new.email@example.com',
      justificationPath: '/documents/justification.pdf',
      requestDate: new Date(),
      status: 'EnCours',
      client: {
        id: 123,
        nom: 'Dupont',
        prenom: 'Jean',
        numCIN: '12345678'
      }
    }
  ];

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['getAccessToken']);
    authServiceMock.getAccessToken.and.returnValue('fake-token');

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AgentService,
        { provide: AuthService, useValue: authServiceMock },
        { provide: 'environnement', useValue: { apiurl: 'http://localhost:5000/api' } }
      ]
    });

    service = TestBed.inject(AgentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getPendingModificationRequests', () => {
    it('should fetch pending modification requests with client data', () => {
      service.getPendingModificationRequests().subscribe(requests => {
        expect(requests.length).toBe(1);
        expect(requests[0].client?.nom).toBe('Dupont');
        expect(requests[0].status).toBe('EnCours');
      });

      const req = httpMock.expectOne(`${apiUrl}/modification-requests/pending`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');
      req.flush(mockModificationRequests);
    });
  });

  describe('downloadJustificationDocument', () => {
    it('should download justification document as blob', () => {
      const requestId = 1;
      const mockBlob = new Blob(['test content'], { type: 'application/pdf' });

      service.downloadJustificationDocument(requestId).subscribe(response => {
        expect(response.body instanceof Blob).toBeTrue();
        expect(response.body?.size).toBe(mockBlob.size);
      });

      const req = httpMock.expectOne(
        `${apiUrl}/modification-requests/${requestId}/document`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockBlob, {
        headers: { 'Content-Type': 'application/pdf' },
        status: 200,
        statusText: 'OK'
      });
    });
  });

  

    
});