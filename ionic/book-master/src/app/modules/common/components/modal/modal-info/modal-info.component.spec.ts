import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';

import { ModalInfoComponent } from './modal-info.component';
import { TranslationTestingModule } from 'src/app/testing/translation-testing.module';

describe('ModalInfoComponent', () => {
  let component: ModalInfoComponent;
  let fixture: ComponentFixture<ModalInfoComponent>;
  const modalCtrlMock = jasmine.createSpyObj('ModalController', ['dismiss']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalInfoComponent ],
      imports: [IonicModule.forRoot(), TranslationTestingModule],
      providers: [{ provide: ModalController, useValue: modalCtrlMock }]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalInfoComponent);
    component = fixture.componentInstance;
    component.data = {
      title: 'Info',
      info: 'Details'
    };
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
