import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular';

import { HomeComponent } from './home.component';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { Service } from '../../../shared/rest-api-client';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  const navCtrlMock = jasmine.createSpyObj('NavController', ['navigateRoot']);
  const authServiceMock = {
    loggedUser: { userId: 'u1' }
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeComponent ],
      imports: [IonicModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: NavController, useValue: navCtrlMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: ActivatedRoute, useValue: { snapshot: { queryParams: {} } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('navigates to editor using stable model token', () => {
    component.createService();

    expect(navCtrlMock.navigateRoot).toHaveBeenCalledWith('Editor', {
      queryParams: {
        type: Service.$t
      }
    });
  });
});
