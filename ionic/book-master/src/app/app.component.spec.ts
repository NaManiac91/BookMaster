import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { AuthService } from './modules/shared/services/auth/auth.service';
import { TranslationTestingModule } from 'src/app/testing/translation-testing.module';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  const authServiceMock = {
    loggedUser: { userId: 'u1' }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [RouterModule.forRoot([]), TranslationTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have menu labels', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.appPages.length).toBe(3);
    expect(app.appPages[0].titleKey).toBe('menu.home');
    expect(app.appPages[1].titleKey).toBe('menu.providers');
    expect(app.appPages[2].titleKey).toBe('menu.history');
  });

  it('should have urls', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const app = fixture.nativeElement;
    const menuItems = app.querySelectorAll('ion-button');
    expect(menuItems.length).toEqual(3);
    expect(menuItems[0].getAttribute('ng-reflect-router-link')).toEqual('/Home');
    expect(menuItems[1].getAttribute('ng-reflect-router-link')).toEqual('/ReservationWorkflow');
    expect(menuItems[2].getAttribute('ng-reflect-router-link')).toEqual('/ReservationHistory');
  });

});
