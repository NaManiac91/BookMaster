import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { of } from 'rxjs';

import { UserDetailComponent } from './user-detail.component';
import { FetchService } from '../../../../../../common/services/fetch-service/fetch.service';
import { TranslationTestingModule } from 'src/app/testing/translation-testing.module';

describe('UserDetailComponent', () => {
  let component: UserDetailComponent;
  let fixture: ComponentFixture<UserDetailComponent>;
  const fetchServiceMock = {
    getServices: jasmine.createSpy('getServices').and.returnValue(of([])),
    getProviders: jasmine.createSpy('getProviders').and.returnValue(of([]))
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UserDetailComponent ],
      imports: [IonicModule.forRoot(), TranslationTestingModule],
      providers: [{ provide: FetchService, useValue: fetchServiceMock }]
    }).compileComponents();

    fixture = TestBed.createComponent(UserDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
