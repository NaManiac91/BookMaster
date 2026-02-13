import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {IModel, Provider, Service, User} from 'src/app/modules/shared/rest-api-client';
import {AuthService} from 'src/app/modules/shared/services/auth/auth.service';
import {NavController} from "@ionic/angular";
import {ActivatedRoute} from "@angular/router";
import {FetchService} from "../../services/fetch-service/fetch.service";
import {Subject, Subscription, of} from "rxjs";
import {catchError, debounceTime, distinctUntilChanged, switchMap} from "rxjs/operators";

type SearchMode = 'provider' | 'service';

interface ServiceSearchResult {
  provider: Provider;
  service: Service;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  user!: User;
  provider!: Provider;
  searchMode: SearchMode = 'provider';
  searchQuery = '';
  providerResults: Provider[] = [];
  serviceResults: ServiceSearchResult[] = [];
  isSearching = false;
  private search$ = new Subject<{query: string, mode: SearchMode}>();
  private searchSub?: Subscription;
  private activatedRoute = inject(ActivatedRoute);

  constructor(private authService: AuthService,
              private fetchService: FetchService,
              private navCtrl: NavController) {
  }

  ngOnInit() {
    const object: IModel = this.activatedRoute.snapshot.queryParams['object'];

    this.initUser(this.authService.loggedUser, object);

    this.searchSub = this.search$.pipe(
      debounceTime(250),
      distinctUntilChanged((a, b) => a.query === b.query && a.mode === b.mode),
      switchMap(payload => {
        const normalized = payload.query.trim();
        if (!normalized) {
          this.isSearching = false;
          return of([]);
        }

        this.isSearching = true;
        return this.fetchService.searchProviders(normalized, payload.mode).pipe(
          catchError(() => of([]))
        );
      })
    ).subscribe((providers: Provider[]) => {
      const mappedProviders = this.mapProviders(providers);

      if (this.searchMode === 'provider') {
        this.providerResults = mappedProviders;
        this.serviceResults = [];
      } else {
        const query = this.searchQuery.trim().toLowerCase();
        const results: ServiceSearchResult[] = [];
        for (const provider of mappedProviders) {
          for (const service of (provider.services || [])) {
            if ((service.name || '').toLowerCase().includes(query)) {
              results.push({provider, service});
            }
          }
        }
        this.serviceResults = results;
        this.providerResults = [];
      }

      this.isSearching = false;
    });
  }

  ngOnDestroy() {
    this.searchSub?.unsubscribe();
  }

  private initUser(user: User, object: IModel) {
    this.user = Object.assign(new User(), user);

    if (this.user.provider) {
      const provider = object && object.$t === Provider.$t ? object : this.user.provider;
      this.provider = this.user.provider = Object.assign(new Provider(), provider);
    }
  }

  goToProviderAdmin() {
    if (!this.provider) {
      return;
    }

    this.navCtrl.navigateRoot('ProviderAdmin');
  }

  get searchHasResults(): boolean {
    if (!this.searchQuery.trim()) {
      return false;
    }

    return this.searchMode === 'provider'
      ? this.providerResults.length > 0
      : this.serviceResults.length > 0;
  }

  get searchHasNoResults(): boolean {
    if (!this.searchQuery.trim() || this.isSearching) {
      return false;
    }

    return this.searchMode === 'provider'
      ? this.providerResults.length === 0
      : this.serviceResults.length === 0;
  }

  openReservationByProvider(provider: Provider) {
    this.navCtrl.navigateRoot('ReservationWorkflow', {
      state: {
        provider: provider
      }
    });
  }

  openReservationByService(result: ServiceSearchResult) {
    this.navCtrl.navigateRoot('ReservationWorkflow', {
      state: {
        provider: result.provider,
        service: result.service
      }
    });
  }

  onSearchQueryChange(query: string | null | undefined) {
    const value = query || '';
    this.searchQuery = value;

    if (!value.trim()) {
      this.providerResults = [];
      this.serviceResults = [];
      this.isSearching = false;
    }

    this.search$.next({query: value, mode: this.searchMode});
  }

  onSearchModeChange(value: SearchMode) {
    this.searchMode = value;
    this.providerResults = [];
    this.serviceResults = [];
    this.search$.next({query: this.searchQuery, mode: this.searchMode});
  }

  private mapProviders(providers: Provider[]): Provider[] {
    return (providers || []).map(provider => {
      const mapped = Object.assign(new Provider(), provider);
      mapped.services = (provider.services || []).map(service => Object.assign(new Service(), service));
      return mapped;
    });
  }
}
