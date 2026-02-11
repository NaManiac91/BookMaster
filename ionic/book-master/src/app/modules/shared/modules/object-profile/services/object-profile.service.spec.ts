import { TestBed } from '@angular/core/testing';

import { ObjectProfile, ObjectProfileService } from './object-profile.service';
import { ObjectProfileView } from '../../../enum';

class TestEntity {}

@ObjectProfile({
  type: TestEntity,
  view: [ObjectProfileView.CONSULT, ObjectProfileView.EDIT]
})
class TestEntityProfileComponent {}

describe('ObjectProfileService', () => {
  let service: ObjectProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObjectProfileService);
    service.cache = {};
  });

  it('returns component associated to type and view', () => {
    const component = service.getObjectProfile(TestEntity.name, ObjectProfileView.CONSULT);

    expect(component).toBe(TestEntityProfileComponent);
  });

  it('caches resolved profile by type and view', () => {
    service.getObjectProfile(TestEntity.name, ObjectProfileView.EDIT);

    expect(service.cache[TestEntity.name]).toBeDefined();
    expect(service.cache[TestEntity.name][ObjectProfileView.EDIT].component).toBe(TestEntityProfileComponent);
  });

  it('returns undefined when profile is not found', () => {
    spyOn(console, 'log');

    const component = service.getObjectProfile('MissingType', ObjectProfileView.CONSULT);

    expect(component).toBeUndefined();
    expect(console.log).toHaveBeenCalledWith('Object Profile not found');
  });
});
