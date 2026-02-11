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
    // Open OAuth URL in system browser
    window.open('http://localhost:8080/oauth2/authorization/google', '_self');
  }

  logout(): Observable<any> {
    return this.httpClient.post(`${this.api}/logout`, {}, {
      withCredentials: true
    });
  }
}
