import { HttpClient } from '@angular/common/http';
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
    const normalizedQuery = query || '';
    const params = [
      'q=' + encodeURIComponent(normalizedQuery),
      'type=' + type
    ];

    if (city && city.trim()) {
      params.push('city=' + encodeURIComponent(city.trim()));
    }

    return this.httpClient.get(this.api + 'searchProviders?' + params.join('&'));
  }

  searchCities(query: string): Observable<string[]> {
    return this.httpClient.get<string[]>(this.api + 'searchCities?q=' + encodeURIComponent(query || ''));
  }

  getProviderById(providerId: string): Observable<any> {
    return this.httpClient.get(this.api + 'getProvider?providerId=' + providerId);
  }
}
