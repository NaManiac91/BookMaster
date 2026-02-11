import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { of } from 'rxjs';

import { ProvidersListComponent } from './providers-list.component';
import { FetchService } from '../../../../../../common/services/fetch-service/fetch.service';

describe('ProvidersListComponent', () => {
  let component: ProvidersListComponent;
  let fixture: ComponentFixture<ProvidersListComponent>;
  const fetchServiceMock = {
    getProviders: jasmine.createSpy('getProviders').and.returnValue(of([]))
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProvidersListComponent ],
      imports: [IonicModule.forRoot()],
      providers: [{ provide: FetchService, useValue: fetchServiceMock }]
    }).compileComponents();

    fixture = TestBed.createComponent(ProvidersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
