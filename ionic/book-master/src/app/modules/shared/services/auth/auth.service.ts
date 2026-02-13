import { Injectable } from '@angular/core';
import { User } from '../../rest-api-client';
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api = '/api';

  constructor(private httpClient: HttpClient) { }

  get loggedUser(): User {
    return localStorage.getItem('loggedUser') ? JSON.parse(<any>localStorage.getItem('loggedUser')) : null;
  }

  set loggedUser(user: User) {
    localStorage.setItem('loggedUser', JSON.stringify(user));
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
