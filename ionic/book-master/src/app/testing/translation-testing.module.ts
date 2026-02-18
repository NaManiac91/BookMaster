import { CommonModule } from '@angular/common';
import { Injectable, NgModule, Pipe, PipeTransform } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { TranslationService } from '../modules/shared/modules/translation/services/translation.service';

@Pipe({
  name: 't'
})
export class MockTranslationPipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

@Injectable()
export class MockTranslationService {
  private languageSubject = new BehaviorSubject<string>('en');
  readonly language$ = this.languageSubject.asObservable();
  readonly currentLanguage = 'en';

  applyUserLanguage(): Observable<void> {
    return of(void 0);
  }

  useLanguage(): Observable<void> {
    return of(void 0);
  }

  translate(key: string): string {
    return key;
  }
}

@NgModule({
  declarations: [MockTranslationPipe],
  imports: [CommonModule],
  exports: [MockTranslationPipe],
  providers: [
    {
      provide: TranslationService,
      useClass: MockTranslationService
    }
  ]
})
export class TranslationTestingModule {}
