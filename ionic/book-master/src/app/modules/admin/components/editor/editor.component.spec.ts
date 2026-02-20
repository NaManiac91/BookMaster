import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { of } from 'rxjs';

import { EditorComponent } from './editor.component';
import { AdminService } from '../../services/admin.service';
import { ModelInitializerService } from '../../../shared/services/model-initializer/model-initializer.service';
import { Service } from '../../../shared/rest-api-client';
import { TranslationTestingModule } from 'src/app/testing/translation-testing.module';

describe('EditorComponent', () => {
  let component: EditorComponent;
  let fixture: ComponentFixture<EditorComponent>;
  const adminServiceMock = {
    create: jasmine.createSpy('create').and.returnValue(of({})),
    edit: jasmine.createSpy('edit').and.returnValue(of({}))
  };
  const modelInitializerServiceMock = {
    getTypeByToken: jasmine.createSpy('getTypeByToken').and.returnValue(Service),
    getTypeByClassName: jasmine.createSpy('getTypeByClassName').and.returnValue(undefined)
  };
  const navCtrlMock = jasmine.createSpyObj('NavController', ['navigateRoot']);
  const routerMock = {
    getCurrentNavigation: jasmine.createSpy('getCurrentNavigation').and.returnValue(null)
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorComponent ],
      imports: [IonicModule.forRoot(), FormsModule, TranslationTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: AdminService, useValue: adminServiceMock },
        { provide: ModelInitializerService, useValue: modelInitializerServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: NavController, useValue: navCtrlMock },
        { provide: ActivatedRoute, useValue: { snapshot: { queryParams: { type: Service.$t } }, queryParams: of({ type: Service.$t }) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
