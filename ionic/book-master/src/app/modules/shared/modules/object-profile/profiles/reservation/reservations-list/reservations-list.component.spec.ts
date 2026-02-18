import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AlertController, IonicModule } from '@ionic/angular';
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

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReservationsListComponent ],
      imports: [IonicModule.forRoot(), TranslationTestingModule],
      providers: [
        { provide: ClientService, useValue: clientServiceMock },
        { provide: AlertController, useValue: alertControllerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReservationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
