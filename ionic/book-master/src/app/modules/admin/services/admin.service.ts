import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Provider, Service} from "../../shared/rest-api-client";
import {Observable, map} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly api = 'api/admin/';
  constructor(private httpClient: HttpClient) { }

  createService(service: Service, providerId: string): Observable<Provider> {
    return <Observable<Provider>>this.httpClient.post(this.api + 'createService', Object.assign(service, { providerId : providerId}))
      .pipe(map((response: any) => Object.assign(new Provider(), response)));
  }
}
