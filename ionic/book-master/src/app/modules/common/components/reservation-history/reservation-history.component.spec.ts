import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import {of} from "rxjs";

import { ReservationHistoryComponent } from './reservation-history.component';
import { AuthService } from '../../../shared/services/auth/auth.service';
import {ClientService} from "../../services/client-service/client.service";
import { TranslationTestingModule } from 'src/app/testing/translation-testing.module';

describe('ReservationHistoryComponent', () => {
  let component: ReservationHistoryComponent;
  let fixture: ComponentFixture<ReservationHistoryComponent>;
  const authServiceMock: any = {
    loggedUser: { userId: 'u1', reservations: [] }
  };
  const clientServiceMock = {
    getReservationHistory: jasmine.createSpy('getReservationHistory').and.returnValue(of([]))
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReservationHistoryComponent ],
      imports: [IonicModule.forRoot(), TranslationTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: ClientService, useValue: clientServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReservationHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
