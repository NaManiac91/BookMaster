import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ServiceCreateComponent } from './service-create.component';
import { Service } from '../../../../../rest-api-client';
import { TranslationTestingModule } from 'src/app/testing/translation-testing.module';

describe('ServiceCreateComponent', () => {
  let component: ServiceCreateComponent;
  let fixture: ComponentFixture<ServiceCreateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceCreateComponent ],
      imports: [IonicModule.forRoot(), FormsModule, TranslationTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceCreateComponent);
    component = fixture.componentInstance;
    component.object = new Service();
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
