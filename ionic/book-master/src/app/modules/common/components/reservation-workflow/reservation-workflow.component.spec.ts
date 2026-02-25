import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { of } from 'rxjs';
import {Router} from "@angular/router";
import {FetchService} from "../../services/fetch-service/fetch.service";

import { ReservationWorkflowComponent } from './reservation-workflow.component';
import { ClientService } from '../../services/client-service/client.service';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { TranslationTestingModule } from 'src/app/testing/translation-testing.module';

describe('ReservationWorkflowComponent', () => {
  let component: ReservationWorkflowComponent;
  let fixture: ComponentFixture<ReservationWorkflowComponent>;
  const clientServiceMock = {
    getAvailableTimeSlots: jasmine.createSpy('getAvailableTimeSlots').and.returnValue(of({})),
    createReservation: jasmine.createSpy('createReservation').and.returnValue(of({}))
  };
  const authServiceMock: any = {
    loggedUser: { userId: 'u1', reservations: [] as any[] }
  };
  const navCtrlMock = jasmine.createSpyObj('NavController', ['navigateRoot']);
  const alertCtrlMock = {
    create: jasmine.createSpy('create').and.returnValue(Promise.resolve({
      present: jasmine.createSpy('present').and.returnValue(Promise.resolve())
    }))
  };
  const routerMock = {
    getCurrentNavigation: jasmine.createSpy('getCurrentNavigation').and.returnValue(null)
  };
  const fetchServiceMock = {
    getProviderById: jasmine.createSpy('getProviderById').and.returnValue(of({ services: [] }))
  };

  beforeEach(waitForAsync(() => {
    authServiceMock.loggedUser = { userId: 'u1', reservations: [] as any[] };
    TestBed.configureTestingModule({
      declarations: [ ReservationWorkflowComponent ],
      imports: [IonicModule.forRoot(), TranslationTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: ClientService, useValue: clientServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: NavController, useValue: navCtrlMock },
        { provide: AlertController, useValue: alertCtrlMock },
        { provide: Router, useValue: routerMock },
        { provide: FetchService, useValue: fetchServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReservationWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('redirects provider users to home', async () => {
    navCtrlMock.navigateRoot.calls.reset();
    alertCtrlMock.create.calls.reset();
    authServiceMock.loggedUser = {
      userId: 'u-provider',
      provider: { providerId: 'p1' },
      reservations: []
    };

    const providerFixture = TestBed.createComponent(ReservationWorkflowComponent);
    const providerComponent = providerFixture.componentInstance;
    providerFixture.detectChanges();
    await providerFixture.whenStable();

    expect(providerComponent.canAccessWorkflow).toBeFalse();
    expect(alertCtrlMock.create).toHaveBeenCalled();
    expect(navCtrlMock.navigateRoot).toHaveBeenCalledWith('Home');
  });
});
