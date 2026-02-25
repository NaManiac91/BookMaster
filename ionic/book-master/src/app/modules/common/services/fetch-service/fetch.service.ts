import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FetchService {
  private readonly api = 'api/fetch/';

  constructor(private httpClient: HttpClient) { }

  getProviders() : Observable<any> {
    return this.httpClient.get(this.api + 'getProviders');
  }

  searchProviders(query: string,
                  type: 'provider' | 'service' | 'all' = 'all',
                  city?: string): Observable<any> {
    let params = new HttpParams()
      .set('q', query || '')
      .set('type', type);

    if (city && city.trim()) {
      params = params.set('city', city.trim());
    }

    return this.httpClient.get(this.api + 'searchProviders', { params });
  }

  searchCities(query: string): Observable<string[]> {
    const params = new HttpParams().set('q', query || '');
    return this.httpClient.get<string[]>(this.api + 'searchCities', { params });
  }

  getProviderById(providerId: string): Observable<any> {
    const params = new HttpParams().set('providerId', providerId);
    return this.httpClient.get(this.api + 'getProvider', { params });
  }
}
