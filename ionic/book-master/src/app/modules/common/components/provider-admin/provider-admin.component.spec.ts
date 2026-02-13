import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule, NavController } from '@ionic/angular';

import { ProviderAdminComponent } from './provider-admin.component';
import { AuthService } from '../../../shared/services/auth/auth.service';

describe('ProviderAdminComponent', () => {
  let component: ProviderAdminComponent;
  let fixture: ComponentFixture<ProviderAdminComponent>;
  const navCtrlMock = jasmine.createSpyObj('NavController', ['navigateRoot']);
  const authServiceMock: any = {
    loggedUser: { userId: 'u1' }
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderAdminComponent ],
      imports: [IonicModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: NavController, useValue: navCtrlMock },
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProviderAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
