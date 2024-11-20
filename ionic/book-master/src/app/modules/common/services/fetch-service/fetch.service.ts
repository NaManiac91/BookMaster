import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FetchService {
  private readonly api = 'api/fetch/';

  constructor(private httpClient: HttpClient) { }

  getServices() : Observable<any> {
    return this.httpClient.get(this.api + 'getServices');
  }

  getServiceById(serviceId: string): Observable<any> {
    return this.httpClient.get(this.api + 'getService?serviceId=' + serviceId);
  }

  getProviders() : Observable<any> {
    return this.httpClient.get(this.api + 'getProviders');
  }

  getProviderById(providerId: string): Observable<any> {
    return this.httpClient.get(this.api + 'getProvider?providerId=' + providerId);
  }

  getUsers() : Observable<any> {
    return this.httpClient.get(this.api + 'getUsers');
  }

  getUserById(userId: string): Observable<any> {
    return this.httpClient.get(this.api + 'getUserById?userId=' + userId);
  }
}
