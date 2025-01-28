import { TestBed } from '@angular/core/testing';

import {ModelInitializerService} from './model-initializer.service';

describe('ModelInitializerService', () => {
  let service: ModelInitializerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModelInitializerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
