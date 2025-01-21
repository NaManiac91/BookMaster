import { TestBed } from '@angular/core/testing';

import { ObjectProfileService } from './object-profile.service';

describe('ObjectProfileService', () => {
  let service: ObjectProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObjectProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
