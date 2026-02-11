import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { of } from 'rxjs';
import { Browser } from '@capacitor/browser';

import { AuthCallbackComponent } from './auth-callback.component';
import { AuthService } from '../../services/auth/auth.service';

describe('AuthCallbackComponent', () => {
  let component: AuthCallbackComponent;
  let fixture: ComponentFixture<AuthCallbackComponent>;
  const authServiceMock: any = {
    getAuthStatus: jasmine.createSpy('getAuthStatus').and.returnValue(of({ authenticated: false })),
    loggedUser: null
  };
  const routerMock = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(waitForAsync(() => {
    spyOn(Browser, 'close').and.returnValue(Promise.resolve());

    TestBed.configureTestingModule({
      declarations: [ AuthCallbackComponent ],
      imports: [IonicModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthCallbackComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
