import { TestBed } from '@angular/core/testing';

import {ModelInitializerService} from './model-initializer.service';
import { IModel, Provider, Reservation, Service, User } from '../../rest-api-client';

describe('ModelInitializerService', () => {
  let service: ModelInitializerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModelInitializerService);
  });

  it('resolves registered model types by stable token', () => {
    expect(service.getTypeByToken('IModel')).toBe(IModel);
    expect(service.getTypeByToken(Provider.$t)).toBe(Provider);
    expect(service.getTypeByToken(Reservation.$t)).toBe(Reservation);
    expect(service.getTypeByToken(Service.$t)).toBe(Service);
    expect(service.getTypeByToken(User.$t)).toBe(User);
  });

  it('keeps backward compatibility with class-name alias', () => {
    expect(service.getTypeByClassName(Service.$t)).toBe(Service);
  });

  it('returns undefined for unknown token', () => {
    expect(service.getTypeByToken('UnknownType')).toBeUndefined();
  });
});
