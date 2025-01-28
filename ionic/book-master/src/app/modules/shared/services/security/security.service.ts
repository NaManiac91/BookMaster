import { Injectable } from '@angular/core';
import {Provider, User} from '../../rest-api-client';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  userChange$: Subject<User> = new Subject<User>();

  constructor() { }

  get loggedUser(): User {
    return localStorage.getItem('loggedUser') ? JSON.parse(<any>localStorage.getItem('loggedUser')) : null;
  }

  set loggedUser(user: User) {
    localStorage.setItem('loggedUser', JSON.stringify(user));
  }

  setProvider(provider: Provider) {
    const user = this.loggedUser;
    user.provider = provider;
    this.loggedUser = user;
    this.userChange$.next(user);
  }
}
