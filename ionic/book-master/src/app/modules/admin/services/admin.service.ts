import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {IModel, Provider, Service, User} from "../../shared/rest-api-client";
import {Observable, map, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly api = 'api/admin/';
  constructor(private httpClient: HttpClient) { }

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
        const provider : Provider = Object.assign(new Provider(), response);
        provider.services = response.services.map((service: Service) => Object.assign(new Service(), service))
        return provider;
      }));
  }

  removeService(serviceId: string): Observable<boolean> {
    return <Observable<boolean>>this.httpClient.get(this.api + 'removeService?serviceId=' + serviceId);
  }
}
