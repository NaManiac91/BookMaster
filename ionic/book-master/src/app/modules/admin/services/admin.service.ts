import { HttpClient } from '@angular/common/http';
import {Injectable, Type} from '@angular/core';
import {IModel, Provider, Reservation, Service, User} from "../../shared/rest-api-client";
import {Observable, map, of, tap, throwError} from "rxjs";
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
      case Service.$t: {
        const providerId = this.authService.loggedUser?.provider?.providerId;
        if (!providerId) {
          return throwError(() => new Error('Missing providerId for service creation'));
        }
        return this.createService(object as Service, providerId);
      }
    }
    return of(object);
  }

  createProvider(object: Provider, userId: string): Observable<Provider> {
    return <Observable<Provider>>this.httpClient.post(this.api + 'createProvider', Object.assign(object, { userId : userId}))
      .pipe(
        map((response: any) => Object.assign(new Provider(), response)),
        tap((provider: Provider) => this.authService.updateLoggedUserProvider(provider))
      );
  }

  createService(service: Service, providerId: string): Observable<Provider> {
    return <Observable<Provider>>this.httpClient.post(this.api + 'createService', Object.assign(service, { providerId : providerId}))
      .pipe(
        map((response: any) => this.convertProviderToClient(response)),
        tap((provider: Provider) => this.authService.updateLoggedUserProvider(provider))
      );
  }

  private convertProviderToClient(response: any) {
    const provider: Provider = Object.assign(new Provider(), response);
    provider.services = (response.services || []).map((service: Service) => Object.assign(new Service(), service))
    return provider;
  }

  private mergeUserFromResponse(response: any): User {
    const currentUser = (this.authService.loggedUser || {}) as Partial<User>;
    const mergedUser = Object.assign(new User(), currentUser, response);
    const hasProviderInResponse = Object.prototype.hasOwnProperty.call(response || {}, 'provider');
    const hasReservationsInResponse = Object.prototype.hasOwnProperty.call(response || {}, 'reservations');

    if (hasProviderInResponse) {
      mergedUser.provider = response?.provider
        ? this.convertProviderToClient(response.provider)
        : undefined as unknown as Provider;
    } else if (currentUser?.provider) {
      mergedUser.provider = this.convertProviderToClient(currentUser.provider);
    }

    if (hasReservationsInResponse) {
      mergedUser.reservations = (response?.reservations || [])
        .map((reservation: Reservation) => Object.assign(new Reservation(), reservation));
    } else {
      mergedUser.reservations = (currentUser?.reservations || [])
        .map((reservation: Reservation) => Object.assign(new Reservation(), reservation));
    }

    return mergedUser;
  }

  edit(object: IModel, type: Type<IModel>): Observable<IModel> {
    const payload = object.$t === Provider.$t
      ? this.toProviderEditPayload(object as Provider)
      : object.$t === User.$t
        ? this.toUserEditPayload(object as User)
        : object;

    return <Observable<IModel>>this.httpClient.post(this.api + `edit${(type as any).$t}`, payload)
      .pipe(map((response: any) => {
        switch (object.$t) {
          case Provider.$t: return this.convertProviderToClient(response);
          case Service.$t: return Object.assign(new type(), response);
          case User.$t: return this.mergeUserFromResponse(response);
        }
        return Object.assign(new type(), response);
      }),
        tap((model: IModel) => {
          if (model?.$t === Provider.$t) {
            this.authService.updateLoggedUserProvider(model as Provider);
            return;
          }

          if (model?.$t === User.$t) {
            this.authService.loggedUser = model as User;
          }
        }));
  }

  private toProviderEditPayload(provider: Provider) {
    return {
      providerId: provider.providerId,
      name: provider.name,
      description: provider.description,
      address: provider.address,
      email: provider.email,
      phone: provider.phone,
      type: provider.type,
      startTime: provider.startTime,
      endTime: provider.endTime,
      timeBlockMinutes: provider.timeBlockMinutes
    };
  }

  private toUserEditPayload(user: User) {
    const payload: any = {
      userId: user.userId,
      username: user.username,
      email: user.email,
      firstName: user.firstName ?? null,
      lastName: user.lastName ?? null,
      language: user.language || 'en'
    };

    if (user.provider) {
      payload.provider = this.toProviderEditPayload(user.provider);
    }

    return payload;
  }

  removeService(serviceId: string): Observable<boolean> {
    return <Observable<boolean>>this.httpClient.get(this.api + 'removeService?serviceId=' + serviceId);
  }
}
