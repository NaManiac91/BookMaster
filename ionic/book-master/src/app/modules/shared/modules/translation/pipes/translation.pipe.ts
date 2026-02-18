import { ChangeDetectorRef, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslationService } from '../services/translation.service';

@Pipe({
  name: 't',
  pure: false
})
export class TranslationPipe implements PipeTransform, OnDestroy {
  private subscription: Subscription;

  constructor(private translationService: TranslationService,
              private cdr: ChangeDetectorRef) {
    this.subscription = this.translationService.language$.subscribe(() => {
      this.cdr.markForCheck();
    });
  }

  transform(key: string, params?: Record<string, string | number | null | undefined>): string {
    return this.translationService.translate(key, params);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
