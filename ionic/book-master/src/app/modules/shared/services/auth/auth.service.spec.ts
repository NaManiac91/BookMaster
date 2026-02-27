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

    const req = httpMock.expectOne('/api/auth/me');
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBeTrue();
    req.flush({ userId: 'u1' });
  });

  it('calls logout endpoint with credentials', () => {
    service.logout().subscribe();

    const req = httpMock.expectOne('/api/auth/logout');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    expect(req.request.withCredentials).toBeTrue();
    req.flush({ ok: true });
  });

  it('calls login endpoint with credentials payload', () => {
    service.login('mario', 'strongpass').subscribe();

    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ identifier: 'mario', password: 'strongpass' });
    expect(req.request.withCredentials).toBeTrue();
    req.flush({ authenticated: true, user: { userId: 'u1' } });
  });

  it('calls register endpoint with credentials payload', () => {
    service.register({ username: 'mario', email: 'mario@bookmaster.test', password: 'strongpass' }).subscribe();

    const req = httpMock.expectOne('/api/auth/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      username: 'mario',
      email: 'mario@bookmaster.test',
      password: 'strongpass'
    });
    expect(req.request.withCredentials).toBeTrue();
    req.flush({ authenticated: true, user: { userId: 'u1' } });
  });

  it('calls change password endpoint with credentials payload', () => {
    service.changePassword('oldPass123', 'newPass123').subscribe();

    const req = httpMock.expectOne('/api/auth/changePassword');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      currentPassword: 'oldPass123',
      newPassword: 'newPass123'
    });
    expect(req.request.withCredentials).toBeTrue();
    req.flush({ authenticated: true, user: { userId: 'u1' } });
  });

  it('opens OAuth login URL in same tab', () => {
    const openSpy = spyOn(window, 'open');

    service.loginWithGoogle();

    expect(openSpy).toHaveBeenCalledWith('/oauth2/authorization/google', '_self');
  });
});
