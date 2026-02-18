import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { FetchService } from './fetch.service';

describe('FetchService', () => {
  let service: FetchService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FetchService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(FetchService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('calls collection fetch endpoints', () => {
    service.getServices().subscribe();
    const servicesReq = httpMock.expectOne('api/fetch/getServices');
    expect(servicesReq.request.method).toBe('GET');
    servicesReq.flush([]);

    service.getProviders().subscribe();
    const providersReq = httpMock.expectOne('api/fetch/getProviders');
    expect(providersReq.request.method).toBe('GET');
    providersReq.flush([]);

    service.getUsers().subscribe();
    const usersReq = httpMock.expectOne('api/fetch/getUsers');
    expect(usersReq.request.method).toBe('GET');
    usersReq.flush([]);
  });

  it('calls detail fetch endpoints with id query params', () => {
    service.getServiceById('s1').subscribe();
    const serviceReq = httpMock.expectOne('api/fetch/getService?serviceId=s1');
    expect(serviceReq.request.method).toBe('GET');
    serviceReq.flush({});

    service.getProviderById('p1').subscribe();
    const providerReq = httpMock.expectOne('api/fetch/getProvider?providerId=p1');
    expect(providerReq.request.method).toBe('GET');
    providerReq.flush({});

    service.searchProviders('nail').subscribe();
    const searchReq = httpMock.expectOne('api/fetch/searchProviders?q=nail&type=all');
    expect(searchReq.request.method).toBe('GET');
    searchReq.flush([]);

    service.searchCities('na').subscribe();
    const citySearchReq = httpMock.expectOne('api/fetch/searchCities?q=na');
    expect(citySearchReq.request.method).toBe('GET');
    citySearchReq.flush([]);

    service.getUserById('u1').subscribe();
    const userReq = httpMock.expectOne('api/fetch/getUserById?userId=u1');
    expect(userReq.request.method).toBe('GET');
    userReq.flush({});
  });
});
