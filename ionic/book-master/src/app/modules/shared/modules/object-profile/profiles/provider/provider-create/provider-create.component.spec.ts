import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ProviderCreateComponent } from './provider-create.component';
import { Address, Provider } from '../../../../../rest-api-client';
import { TranslationTestingModule } from 'src/app/testing/translation-testing.module';

describe('ProviderCreateComponent', () => {
  let component: ProviderCreateComponent;
  let fixture: ComponentFixture<ProviderCreateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderCreateComponent ],
      imports: [IonicModule.forRoot(), FormsModule, TranslationTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ProviderCreateComponent);
    component = fixture.componentInstance;
    component.object = new Provider();
    component.object.address = new Address();
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
