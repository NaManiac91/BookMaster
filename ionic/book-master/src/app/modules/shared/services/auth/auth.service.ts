import { Injectable } from '@angular/core';
import { Provider, User } from '../../rest-api-client';
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

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
    return this.httpClient.get(`${this.api}/user`, {
      withCredentials: true
    });
  }

  login() {
    // Use same-origin path so Docker/nginx proxy and local proxy both work.
    window.open('/oauth2/authorization/google', '_self');
  }

  logout(): Observable<any> {
    return this.httpClient.post('/logout', {}, {
      withCredentials: true
    });
  }
}
