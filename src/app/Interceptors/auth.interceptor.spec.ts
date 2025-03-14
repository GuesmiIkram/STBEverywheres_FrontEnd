import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth.service';
import { of, throwError } from 'rxjs';

describe('AuthInterceptor', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let authService: any; // Utilisez `any` ou un type personnalisé si nécessaire

  beforeEach(() => {
    // Créez un spy object pour AuthService
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'getAccessToken',
      'refreshToken',
      'logout',
    ]);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true,
        },
        { provide: AuthService, useValue: authServiceSpy },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService); // Injectez le spy
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should add an Authorization header', () => {
    const token = 'fake-token';
    authService.getAccessToken.and.returnValue(token);

    httpClient.get('/data').subscribe();

    const req = httpTestingController.expectOne('/data');
    expect(req.request.headers.has('Authorization')).toBeTruthy();
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
  });

  it('should handle 401 error and refresh token', () => {
    const newToken = 'new-fake-token';
    authService.getAccessToken.and.returnValue('fake-token');
    authService.refreshToken.and.returnValue(of({ AccessToken: newToken }));

    httpClient.get('/data').subscribe();

    const req = httpTestingController.expectOne('/data');
    req.flush('', { status: 401, statusText: 'Unauthorized' });

    const refreshReq = httpTestingController.expectOne('/refresh-token-endpoint');
    refreshReq.flush({ AccessToken: newToken });

    const retryReq = httpTestingController.expectOne('/data');
    expect(retryReq.request.headers.get('Authorization')).toBe(`Bearer ${newToken}`);
  });

  it('should logout if refresh token fails', () => {
    authService.getAccessToken.and.returnValue('fake-token');
    authService.refreshToken.and.returnValue(
      throwError(() => new Error('Refresh token failed'))
    );

    httpClient.get('/data').subscribe({
      error: (err) => {
        expect(err).toBeTruthy();
      },
    });

    const req = httpTestingController.expectOne('/data');
    req.flush('', { status: 401, statusText: 'Unauthorized' });

    const refreshReq = httpTestingController.expectOne('/refresh-token-endpoint');
    refreshReq.flush('', { status: 400, statusText: 'Bad Request' });

    expect(authService.logout).toHaveBeenCalled();
  });
});