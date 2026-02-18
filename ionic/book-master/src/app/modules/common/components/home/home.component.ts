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
  searchLocation = '';
  selectedCity = '';
  citySuggestions: string[] = [];
  showCitySuggestions = false;
  providerResults: Provider[] = [];
  serviceResults: ServiceSearchResult[] = [];
  isSearching = false;
  private search$ = new Subject<{query: string, mode: SearchMode, location: string}>();
  private searchSub?: Subscription;
  private citySearch$ = new Subject<string>();
  private citySearchSub?: Subscription;
  private activatedRoute = inject(ActivatedRoute);

  constructor(private authService: AuthService,
              private fetchService: FetchService,
              private navCtrl: NavController) {
  }

  ngOnInit() {
    const object: IModel = this.activatedRoute.snapshot.queryParams['object'];

    this.initUser(this.authService.loggedUser, object);

    this.searchSub = this.search$.pipe(
      debounceTime(500),
      distinctUntilChanged((a, b) =>
        a.mode === b.mode &&
        a.query.trim().toLowerCase() === b.query.trim().toLowerCase() &&
        a.location.trim().toLowerCase() === b.location.trim().toLowerCase()
      ),
      switchMap(payload => {
        const normalized = payload.query.trim();
        const normalizedLocation = payload.location.trim();
        if (!normalized && !normalizedLocation) {
          this.isSearching = false;
          return of([]);
        }

        this.isSearching = true;
        return this.fetchService.searchProviders(normalized, payload.mode, normalizedLocation).pipe(
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

    this.citySearchSub = this.citySearch$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((value: string) => {
        const normalized = value.trim();
        if (normalized.length < 3) {
          return of([]);
        }
        return this.fetchService.searchCities(normalized).pipe(
          catchError(() => of([]))
        );
      })
    ).subscribe((cities: string[]) => {
      this.citySuggestions = cities || [];
      this.showCitySuggestions = !!this.searchLocation.trim() && !this.selectedCity && this.citySuggestions.length > 0;
    });
  }

  ngOnDestroy() {
    this.searchSub?.unsubscribe();
    this.citySearchSub?.unsubscribe();
  }

  private initUser(user: User, object: IModel) {
    this.user = Object.assign(new User(), user);

    if (this.user.provider) {
      const provider = object && object.$t === Provider.$t ? object : this.user.provider;
      this.provider = this.user.provider = Object.assign(new Provider(), provider);
    }

    this.authService.loggedUser = this.user;
  }

  goToProviderAdmin() {
    this.navCtrl.navigateRoot('ProviderAdmin');
  }

  get searchHasResults(): boolean {
    if (!this.searchQuery.trim() && !this.selectedCity.trim()) {
      return false;
    }

    return this.searchMode === 'provider'
      ? this.providerResults.length > 0
      : this.serviceResults.length > 0;
  }

  get searchHasNoResults(): boolean {
    if ((!this.searchQuery.trim() && !this.selectedCity.trim()) || this.isSearching) {
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
    this.searchQuery = query || '';
    this.runSearchIfReady();
  }

  onSearchLocationChange(location: string | null | undefined) {
    const value = location || '';
    this.searchLocation = value;

    if (!value.trim()) {
      this.selectedCity = '';
      this.citySuggestions = [];
      this.showCitySuggestions = false;
      this.runSearchIfReady();
      return;
    }

    if (this.selectedCity && this.selectedCity.trim().toLowerCase() === value.trim().toLowerCase()) {
      return;
    }

    this.selectedCity = '';
    this.clearSearchResults();
    this.citySearch$.next(value);
  }

  selectCity(city: string) {
    this.selectedCity = city;
    this.searchLocation = city;
    this.citySuggestions = [];
    this.showCitySuggestions = false;
    this.runSearchIfReady();
  }

  private runSearchIfReady() {
    const normalizedQuery = this.searchQuery.trim();
    const normalizedLocationInput = this.searchLocation.trim();
    const normalizedSelectedCity = this.selectedCity.trim();

    // City filtering is applied only after explicit city selection from dropdown.
    if (normalizedLocationInput && !normalizedSelectedCity) {
      this.clearSearchResults();
      return;
    }

    if (!normalizedQuery && !normalizedSelectedCity) {
      this.clearSearchResults();
      return;
    }

    this.search$.next({
      query: this.searchQuery,
      mode: this.searchMode,
      location: this.selectedCity
    });
  }

  onSearchModeChange(value: SearchMode) {
    this.searchMode = value;
    this.runSearchIfReady();
  }

  private clearSearchResults() {
    this.providerResults = [];
    this.serviceResults = [];
    this.isSearching = false;
  }

  private mapProviders(providers: Provider[]): Provider[] {
    return (providers || []).map(provider => {
      const mapped = Object.assign(new Provider(), provider);
      mapped.services = (provider.services || []).map(service => Object.assign(new Service(), service));
      return mapped;
    });
  }
}
