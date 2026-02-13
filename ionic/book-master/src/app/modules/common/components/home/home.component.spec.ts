import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular';

import { HomeComponent } from './home.component';
import { AuthService } from '../../../shared/services/auth/auth.service';
import {Provider} from '../../../shared/rest-api-client';
import {FetchService} from "../../services/fetch-service/fetch.service";
import {of} from "rxjs";

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  const navCtrlMock = jasmine.createSpyObj('NavController', ['navigateRoot']);
  const authServiceMock = {
    loggedUser: { userId: 'u1' }
  };
  const fetchServiceMock = {
    searchProviders: jasmine.createSpy('searchProviders').and.returnValue(of([]))
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeComponent ],
      imports: [IonicModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: NavController, useValue: navCtrlMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: FetchService, useValue: fetchServiceMock },
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
});
