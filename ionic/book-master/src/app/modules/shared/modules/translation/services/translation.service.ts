import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from '../../../rest-api-client';

export type SupportedLanguage = 'en' | 'it' | 'fr';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private readonly api = 'api/fetch/';
  private readonly defaultLanguage: SupportedLanguage = 'en';
  private readonly supportedLanguages = new Set<SupportedLanguage>(['en', 'it', 'fr']);

  private currentLanguageSubject = new BehaviorSubject<SupportedLanguage>(this.defaultLanguage);
  private dictionarySubject = new BehaviorSubject<Record<string, string>>({});
  private cache = new Map<SupportedLanguage, Record<string, string>>();

  readonly language$ = this.currentLanguageSubject.asObservable();

  constructor(private httpClient: HttpClient) {}

  get currentLanguage(): SupportedLanguage {
    return this.currentLanguageSubject.value;
  }

  applyUserLanguage(user?: User | null): Observable<void> {
    return this.useLanguage(user?.language);
  }

  useLanguage(language?: string | null): Observable<void> {
    const normalized = this.normalizeLanguage(language);

    return this.loadDictionaryWithFallback(normalized).pipe(
      tap((dictionary: Record<string, string>) => {
        this.currentLanguageSubject.next(normalized);
        this.dictionarySubject.next(dictionary);
      }),
      map(() => void 0)
    );
  }

  translate(key: string, params?: Record<string, string | number | null | undefined>): string {
    if (!key) {
      return '';
    }

    const value = this.dictionarySubject.value[key] || key;
    return this.interpolate(value, params);
  }

  private normalizeLanguage(language?: string | null): SupportedLanguage {
    const normalized = (language || this.defaultLanguage).trim().toLowerCase();
    if (this.supportedLanguages.has(normalized as SupportedLanguage)) {
      return normalized as SupportedLanguage;
    }
    return this.defaultLanguage;
  }

  private loadDictionaryWithFallback(language: SupportedLanguage): Observable<Record<string, string>> {
    if (language === this.defaultLanguage) {
      return this.loadDictionary(language);
    }

    return this.loadDictionary(language).pipe(
      map((dictionary: Record<string, string>) => {
        const english = this.cache.get(this.defaultLanguage);
        if (!english) {
          return dictionary;
        }
        return {
          ...english,
          ...dictionary
        };
      }),
      catchError(() => this.loadDictionary(this.defaultLanguage))
    );
  }

  private loadDictionary(language: SupportedLanguage): Observable<Record<string, string>> {
    const cached = this.cache.get(language);
    if (cached) {
      return of(cached);
    }

    return this.httpClient
      .get<Record<string, string>>(this.api + 'getTranslations?language=' + language)
      .pipe(
        map((dictionary: Record<string, string> | null | undefined) => dictionary || {}),
        tap((dictionary: Record<string, string>) => this.cache.set(language, dictionary)),
        catchError(() => of({}))
      );
  }

  private interpolate(template: string, params?: Record<string, string | number | null | undefined>): string {
    if (!params) {
      return template;
    }

    return template.replace(/{{\s*([\w.]+)\s*}}/g, (_, token: string) => {
      const value = params[token];
      if (value === null || value === undefined) {
        return '';
      }
      return String(value);
    });
  }
}
