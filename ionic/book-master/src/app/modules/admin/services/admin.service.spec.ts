import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { AdminService } from './admin.service';
import { AuthService } from '../../shared/services/auth/auth.service';
import { IModel, Provider, Service } from '../../shared/rest-api-client';

describe('AdminService', () => {
  let service: AdminService;
  let httpMock: HttpTestingController;
  const authServiceMock = {
    loggedUser: {
      userId: 'user-42',
      provider: {
        providerId: 'provider-42'
      }
    },
    updateLoggedUserProvider: jasmine.createSpy('updateLoggedUserProvider')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AdminService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authServiceMock }
      ]
    });

    service = TestBed.inject(AdminService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('create delegates provider creation using logged user id', () => {
    const provider = new Provider();
    let result: IModel | undefined;

    service.create(provider).subscribe((response) => {
      result = response;
    });

    const req = httpMock.expectOne('api/admin/createProvider');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.userId).toBe('user-42');
    req.flush({ providerId: 'p1', name: 'Provider 1' });

    expect(result instanceof Provider).toBeTrue();
    expect((result as Provider).providerId).toBe('p1');
  });

  it('create delegates service creation using logged provider id and maps nested services', () => {
    const serviceModel = new Service();
    let result: IModel | undefined;

    service.create(serviceModel).subscribe((response) => {
      result = response;
    });

    const req = httpMock.expectOne('api/admin/createService');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.providerId).toBe('provider-42');
    req.flush({
      providerId: 'provider-42',
      services: [{ serviceId: 's1', name: 'Nails' }]
    });

    expect(result instanceof Provider).toBeTrue();
    expect((result as Provider).services[0] instanceof Service).toBeTrue();
    expect((result as Provider).services[0].serviceId).toBe('s1');
  });

  it('create returns the same object when type is not managed', () => {
    const unknown = { $t: 'Unknown' } as IModel;
    let result: IModel | undefined;

    service.create(unknown).subscribe((response) => {
      result = response;
    });

    expect(result).toBe(unknown);
    httpMock.expectNone('api/admin/createProvider');
    httpMock.expectNone('api/admin/createService');
  });

  it('edit provider maps nested services to Service instances', () => {
    const provider = new Provider();
    let result: IModel | undefined;

    service.edit(provider, Provider).subscribe((response) => {
      result = response;
    });

    const req = httpMock.expectOne('api/admin/editProvider');
    expect(req.request.method).toBe('POST');
    req.flush({
      providerId: 'p2',
      services: [{ serviceId: 's2', name: 'Massage' }]
    });

    expect(result instanceof Provider).toBeTrue();
    expect((result as Provider).services[0] instanceof Service).toBeTrue();
  });

  it('edit service maps response to Service instance', () => {
    const serviceModel = new Service();
    let result: IModel | undefined;

    service.edit(serviceModel, Service).subscribe((response) => {
      result = response;
    });

    const req = httpMock.expectOne('api/admin/editService');
    expect(req.request.method).toBe('POST');
    req.flush({ serviceId: 's3', name: 'Consulting' });

    expect(result instanceof Service).toBeTrue();
    expect((result as Service).serviceId).toBe('s3');
  });

  it('calls removeService endpoint with service id', () => {
    service.removeService('service-10').subscribe();

    const req = httpMock.expectOne('api/admin/removeService?serviceId=service-10');
    expect(req.request.method).toBe('GET');
    req.flush(true);
  });
});
