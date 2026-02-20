import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AlertController, IonicModule, NavController } from '@ionic/angular';
import { of } from 'rxjs';

import { ReservationsListComponent } from './reservations-list.component';
import { ClientService } from '../../../../../../common/services/client-service/client.service';
import { TranslationTestingModule } from 'src/app/testing/translation-testing.module';

describe('ReservationsListComponent', () => {
  let component: ReservationsListComponent;
  let fixture: ComponentFixture<ReservationsListComponent>;
  const clientServiceMock = {
    removeReservation: jasmine.createSpy('removeReservation').and.returnValue(of(true))
  };
  const alertControllerMock = jasmine.createSpyObj('AlertController', ['create']);
  const navCtrlMock = jasmine.createSpyObj('NavController', ['navigateRoot']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReservationsListComponent ],
      imports: [IonicModule.forRoot(), TranslationTestingModule],
      providers: [
        { provide: ClientService, useValue: clientServiceMock },
        { provide: AlertController, useValue: alertControllerMock },
        { provide: NavController, useValue: navCtrlMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReservationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('filters reservations by selected date when enabled', () => {
    const today = new Date();
    const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    component.list = [
      { reservationId: 'r1', date: today, slots: '09:00', providerName: 'A', service: { name: 's1' } as any } as any,
      { reservationId: 'r2', date: tomorrow, slots: '10:00', providerName: 'B', service: { name: 's2' } as any } as any
    ];
    component.filterBySelectedDate = true;
    component.filterDateIso = todayIso;

    expect(component.futureReservations.length).toBe(1);
    expect(component.futureReservations[0].reservationId).toBe('r1');
  });
});
