import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AlertController, IonicModule, NavController } from '@ionic/angular';
import { of } from 'rxjs';

import { ProviderConsultComponent } from './provider-consult.component';
import { AdminService } from '../../../../../../admin/services/admin.service';
import { AuthService } from '../../../../../services/auth/auth.service';
import { TranslationTestingModule } from 'src/app/testing/translation-testing.module';

describe('ProviderConsultComponent', () => {
  let component: ProviderConsultComponent;
  let fixture: ComponentFixture<ProviderConsultComponent>;
  const adminServiceMock = {
    removeService: jasmine.createSpy('removeService').and.returnValue(of(true))
  };
  const navCtrlMock = jasmine.createSpyObj('NavController', ['navigateRoot']);
  const alertControllerMock = jasmine.createSpyObj('AlertController', ['create']);
  const authServiceMock = jasmine.createSpyObj('AuthService', ['updateLoggedUserProvider']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderConsultComponent ],
      imports: [IonicModule.forRoot(), TranslationTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: NavController, useValue: navCtrlMock },
        { provide: AdminService, useValue: adminServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: AlertController, useValue: alertControllerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProviderConsultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
