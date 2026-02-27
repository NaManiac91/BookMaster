import { Injectable } from '@angular/core';
import { Provider, User } from '../../rest-api-client';
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

export interface AuthPayload {
  authenticated: boolean;
  user: User;
  requiresPasswordChange?: boolean;
  message?: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  language?: string;
  provider?: Provider;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api = '/api';
  private loggedUserCache: User | null | undefined = undefined;

  constructor(private httpClient: HttpClient) { }

  get loggedUser(): User {
    if (this.loggedUserCache !== undefined) {
      return this.loggedUserCache as User;
    }

    const raw = localStorage.getItem('loggedUser');
    this.loggedUserCache = raw ? JSON.parse(raw) : null;
    return this.loggedUserCache as User;
  }

  set loggedUser(user: User) {
    if (!user) {
      this.loggedUserCache = null;
      localStorage.removeItem('loggedUser');
      return;
    }

    const normalizedUser = user as User;
    if (!normalizedUser.language) {
      normalizedUser.language = 'en';
    }

    this.loggedUserCache = normalizedUser;
    localStorage.setItem('loggedUser', JSON.stringify(normalizedUser));
  }

  updateLoggedUserProvider(provider: Provider): void {
    const loggedUser = this.loggedUser;
    if (!loggedUser) {
      return;
    }
    this.loggedUser = Object.assign(new User(), loggedUser, { provider });
  }

  getAuthStatus(): Observable<any> {
    return this.httpClient.get(`${this.api}/auth/status`, {
      withCredentials: true
    });
  }

  getCurrentUser(): Observable<any> {
    return this.httpClient.get(`${this.api}/auth/me`, {
      withCredentials: true
    });
  }

  loginWithGoogle() {
    // Use same-origin path so Docker/nginx proxy and local proxy both work.
    window.open('/oauth2/authorization/google', '_self');
  }

  login(identifier: string, password: string): Observable<AuthPayload> {
    return this.httpClient.post<AuthPayload>(`${this.api}/auth/login`, {
      identifier,
      password
    }, {
      withCredentials: true
    });
  }

  register(payload: RegisterPayload): Observable<AuthPayload> {
    return this.httpClient.post<AuthPayload>(`${this.api}/auth/register`, payload, {
      withCredentials: true
    });
  }

  changePassword(currentPassword: string, newPassword: string): Observable<AuthPayload> {
    return this.httpClient.post<AuthPayload>(`${this.api}/auth/changePassword`, {
      currentPassword,
      newPassword
    }, {
      withCredentials: true
    });
  }

  logout(): Observable<any> {
    this.loggedUser = null as any;
    return this.httpClient.post(`${this.api}/auth/logout`, {}, {
      withCredentials: true
    });
  }
}
