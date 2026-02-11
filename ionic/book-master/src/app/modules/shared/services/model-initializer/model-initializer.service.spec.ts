import { TestBed } from '@angular/core/testing';

import {ModelInitializerService} from './model-initializer.service';
import { IModel, Provider, Reservation, Service, User } from '../../rest-api-client';

describe('ModelInitializerService', () => {
  let service: ModelInitializerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModelInitializerService);
  });

  it('resolves registered model types by class name', () => {
    expect(service.getTypeByClassName(IModel.name)).toBe(IModel);
    expect(service.getTypeByClassName(Provider.name)).toBe(Provider);
    expect(service.getTypeByClassName(Reservation.name)).toBe(Reservation);
    expect(service.getTypeByClassName(Service.name)).toBe(Service);
    expect(service.getTypeByClassName(User.name)).toBe(User);
  });

  it('returns undefined for unknown class name', () => {
    expect(service.getTypeByClassName('UnknownType')).toBeUndefined();
  });
});
