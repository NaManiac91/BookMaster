import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { AuthService } from './auth.service';
import { User } from '../../rest-api-client';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.removeItem('loggedUser');
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.removeItem('loggedUser');
  });

  it('returns null when loggedUser is not present', () => {
    expect(service.loggedUser).toBeNull();
  });

  it('stores and reads loggedUser from localStorage', () => {
    const user = { userId: 'u1', username: 'mario' } as User;

    service.loggedUser = user;

    expect(localStorage.getItem('loggedUser')).toBe(JSON.stringify(user));
    expect(service.loggedUser).toEqual(user);
  });

  it('calls auth status endpoint with credentials', () => {
    service.getAuthStatus().subscribe();

    const req = httpMock.expectOne('/api/auth/status');
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBeTrue();
    req.flush({ ok: true });
  });

  it('calls current user endpoint with credentials', () => {
    service.getCurrentUser().subscribe();

    const req = httpMock.expectOne('/api/user');
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBeTrue();
    req.flush({ userId: 'u1' });
  });

  it('calls logout endpoint with credentials', () => {
    service.logout().subscribe();

    const req = httpMock.expectOne('/api/logout');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    expect(req.request.withCredentials).toBeTrue();
    req.flush({ ok: true });
  });

  it('opens OAuth login URL in same tab', () => {
    const openSpy = spyOn(window, 'open');

    service.login();

    expect(openSpy).toHaveBeenCalledWith('/oauth2/authorization/google', '_self');
  });
});
