import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { AuthService } from './modules/shared/services/auth/auth.service';
import { TranslationTestingModule } from 'src/app/testing/translation-testing.module';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  const authServiceMock: any = {
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
    authServiceMock.loggedUser = { userId: 'u1' };
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.appPages.length).toBe(2);
    expect(app.appPages[0].titleKey).toBe('menu.home');
    expect(app.appPages[1].titleKey).toBe('menu.providers');
  });

  it('should have urls', () => {
    authServiceMock.loggedUser = { userId: 'u1' };
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const app = fixture.nativeElement;
    const menuItems = app.querySelectorAll('ion-button');
    expect(menuItems.length).toEqual(2);
    expect(menuItems[0].getAttribute('ng-reflect-router-link')).toEqual('/Home');
    expect(menuItems[1].getAttribute('ng-reflect-router-link')).toEqual('/ReservationWorkflow');
  });

  it('hides booking entry for provider users', () => {
    authServiceMock.loggedUser = {
      userId: 'u1',
      provider: { providerId: 'p1' }
    };

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const app = fixture.componentInstance;
    const menuItems = fixture.nativeElement.querySelectorAll('ion-button');
    expect(app.appPages.length).toBe(1);
    expect(app.appPages[0].url).toBe('/Home');
    expect(menuItems.length).toEqual(1);
  });

});
