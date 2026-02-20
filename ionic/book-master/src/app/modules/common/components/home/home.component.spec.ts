import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular';

import { HomeComponent } from './home.component';
import { AuthService } from '../../../shared/services/auth/auth.service';
import {Provider} from '../../../shared/rest-api-client';
import {FetchService} from "../../services/fetch-service/fetch.service";
import {of} from "rxjs";
import { TranslationTestingModule } from 'src/app/testing/translation-testing.module';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  const navCtrlMock = jasmine.createSpyObj('NavController', ['navigateRoot']);
  const authServiceMock: any = {
    loggedUser: { userId: 'u1', reservations: [] }
  };
  const fetchServiceMock = {
    searchProviders: jasmine.createSpy('searchProviders').and.returnValue(of([])),
    searchCities: jasmine.createSpy('searchCities').and.returnValue(of([]))
  };
  const routerMock = {
    getCurrentNavigation: jasmine.createSpy('getCurrentNavigation').and.returnValue(null)
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeComponent ],
      imports: [IonicModule.forRoot(), TranslationTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: NavController, useValue: navCtrlMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: FetchService, useValue: fetchServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: { snapshot: { queryParams: {} } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('navigates to provider admin section', () => {
    component.provider = Object.assign(new Provider(), { providerId: 'p1' });

    component.goToProviderAdmin();

    expect(navCtrlMock.navigateRoot).toHaveBeenCalledWith('ProviderAdmin');
  });

  it('navigates to reservation workflow from search result', () => {
    const selectedProvider = Object.assign(new Provider(), { providerId: 'p-search' });

    component.openReservationByProvider(selectedProvider);

    expect(navCtrlMock.navigateRoot).toHaveBeenCalledWith('ReservationWorkflow', {
      state: {
        provider: selectedProvider
      }
    });
  });

  it('initializes provider calendar and reservation counters for provider users', () => {
    const today = new Date();
    const todayIsoDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    authServiceMock.loggedUser = {
      userId: 'u-provider',
      language: 'it',
      provider: {
        providerId: 'p1',
        services: [],
        startTime: '2026-02-20T09:00:00',
        endTime: '2026-02-20T17:00:00',
        timeBlockMinutes: 30
      },
      reservations: [
        { reservationId: 'r1', date: today, slots: '09:00' }
      ]
    };

    const providerFixture = TestBed.createComponent(HomeComponent);
    const providerComponent = providerFixture.componentInstance;
    providerFixture.detectChanges();

    expect(providerComponent.isProviderUser).toBeTrue();
    expect(providerComponent.providerSelectedDate).toBe(todayIsoDate);
    expect(providerComponent.providerDotLevelsByDate[todayIsoDate]).toBe('high');
  });
});
