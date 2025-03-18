import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {IModel, Provider, Service, User} from "../../shared/rest-api-client";
import {Observable, map, of} from "rxjs";
import {SecurityService} from "../../shared/services/security/security.service";

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly api = 'api/admin/';
  constructor(private httpClient: HttpClient,
              private securityService: SecurityService) { }

  create(object: IModel, user: User): Observable<IModel> {
    switch (object.$t) {
      case Provider.$t: return this.createProvider(object as Provider, user.userId);
      case Service.$t: return this.createService(object as Service, user.provider.providerId);
    }
    return of(object);
  }

  createProvider(object: Provider, userId: string): Observable<Provider> {
    return <Observable<Provider>>this.httpClient.post(this.api + 'createProvider', Object.assign(object, { userId : userId}))
      .pipe(map((response: any) => Object.assign(new Provider(), response)));
  }

  createService(service: Service, providerId: string): Observable<Provider> {
    return <Observable<Provider>>this.httpClient.post(this.api + 'createService', Object.assign(service, { providerId : providerId}))
      .pipe(map((response: any) => {
        return this.securityService.loggedUser.provider = Object.assign(new Provider(), response);
      }));
  }

  removeService(serviceId: string): Observable<boolean> {
    return <Observable<boolean>>this.httpClient.get(this.api + 'removeService?serviceId=' + serviceId);
  }
}
