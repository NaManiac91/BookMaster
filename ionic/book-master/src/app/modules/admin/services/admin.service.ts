import { HttpClient } from '@angular/common/http';
import {Injectable, Type} from '@angular/core';
import {IModel, Provider, Service} from "../../shared/rest-api-client";
import {Observable, map, of} from "rxjs";
import {AuthService} from "../../shared/services/auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly api = 'api/admin/';
  constructor(private httpClient: HttpClient,
              private authService: AuthService) { }

  create(object: IModel): Observable<IModel> {
    switch (object.$t) {
      case Provider.$t: return this.createProvider(object as Provider, this.authService.loggedUser.userId);
      case Service.$t: return this.createService(object as Service, this.authService.loggedUser.provider.providerId);
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
        return this.convertProviderToClient(response);
      }));
  }

  private convertProviderToClient(response: any) {
    const provider: Provider = Object.assign(new Provider(), response);
    provider.services = response.services.map((service: Service) => Object.assign(new Service(), service))
    return provider;
  }

  edit(object: IModel, type: Type<IModel>): Observable<IModel> {
    return <Observable<IModel>>this.httpClient.post(this.api + `edit${(type as any).$t}`, object)
      .pipe(map((response: any) => {
        switch (object.$t) {
          case Provider.$t: return this.convertProviderToClient(response);
          case Service.$t: return Object.assign(new type(), response);
        }
        return response;
      }));
  }

  removeService(serviceId: string): Observable<boolean> {
    return <Observable<boolean>>this.httpClient.get(this.api + 'removeService?serviceId=' + serviceId);
  }
}
