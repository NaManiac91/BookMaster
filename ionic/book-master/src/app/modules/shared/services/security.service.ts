import { Injectable } from '@angular/core';
import { User } from '../rest-api-client';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  constructor() { }

  get loggedUser(): User {
    return localStorage.getItem('loggedUser') ? JSON.parse(<any>localStorage.getItem('loggedUser')) : null;
  }

  set loggedUser(user: User) {
    localStorage.setItem('loggedUser', JSON.stringify(user));
  }
}
