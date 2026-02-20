import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MenuController, NavController } from '@ionic/angular';
import { of } from 'rxjs';

import { FolderPage } from './folder.page';
import { AuthService } from '../shared/services/auth/auth.service';
import { TranslationTestingModule } from 'src/app/testing/translation-testing.module';
import { ObjectProfileView } from '../shared/enum';

describe('FolderPage', () => {
  let component: FolderPage;
  let fixture: ComponentFixture<FolderPage>;
  const navCtrlMock = jasmine.createSpyObj('NavController', ['navigateRoot']);
  const routerMock = jasmine.createSpyObj('Router', ['navigate']);
  const menuControllerMock = jasmine.createSpyObj('MenuController', ['close']);
  menuControllerMock.close.and.returnValue(Promise.resolve(true));
  const authServiceMock: any = {
    loggedUser: null,
    logout: jasmine.createSpy('logout').and.returnValue(of({}))
  };

  beforeEach(async () => {
    spyOn(console, 'error').and.callFake((...args: any[]) => {
      const first = args[0];
      if (typeof first === 'string' && first.includes('Menu: must have a "content" element')) {
        return;
      }
    });

    await TestBed.configureTestingModule({
      declarations: [FolderPage],
      imports: [RouterModule.forRoot([]), TranslationTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: NavController, useValue: navCtrlMock },
        { provide: Router, useValue: routerMock },
        { provide: MenuController, useValue: menuControllerMock },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => 'Home' } } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FolderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('opens history from side menu', async () => {
    await component.openHistory();

    expect(menuControllerMock.close).toHaveBeenCalledWith('folder-side-menu');
    expect(navCtrlMock.navigateRoot).toHaveBeenCalledWith('ReservationHistory');
  });

  it('opens account editor from side menu', async () => {
    authServiceMock.loggedUser = { userId: 'u1', username: 'tester', $t: 'User' };

    await component.openAccount();

    expect(menuControllerMock.close).toHaveBeenCalledWith('folder-side-menu');
    expect(routerMock.navigate).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['Editor'], {
      queryParams: jasmine.objectContaining({
        context: jasmine.any(Number)
      }),
      state: {
        object: authServiceMock.loggedUser,
        view: ObjectProfileView.EDIT
      }
    });
  });
});
