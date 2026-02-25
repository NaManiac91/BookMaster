import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FetchService} from "../../../../../../common/services/fetch-service/fetch.service";
import {Provider} from "../../../../../rest-api-client";
import {ObjectProfile} from "../../../services/object-profile.service";
import {ObjectProfileView} from "../../../../../enum";
import {TranslationService} from "../../../../translation/services/translation.service";
import {Subject, Subscription} from "rxjs";
import {debounceTime, distinctUntilChanged} from "rxjs/operators";

interface ProviderSearchRow {
  provider: Provider;
  city: string;
  cityLabel: string;
  type: string;
  searchText: string;
}

@ObjectProfile({
  view: ObjectProfileView.LIST,
  type: Provider
})
@Component({
  selector: 'app-providers-list',
  templateUrl: './providers-list.component.html',
  styleUrls: ['./providers-list.component.scss'],
})
export class ProvidersListComponent implements OnInit, OnDestroy {
  @Output() selected: EventEmitter<Provider> = new EventEmitter();

  providers: Provider[] = [];
  filteredProviders: Provider[] = [];
  providerTypeOptions: string[] = [];
  searchQuery = '';
  searchLocation = '';
  selectedCity = '';
  selectedProviderType = '';
  citySuggestions: string[] = [];
  showCitySuggestions = false;
  private providerSearchRows: ProviderSearchRow[] = [];
  private readonly filterTrigger$ = new Subject<void>();
  private readonly citySuggestionsTrigger$ = new Subject<string>();
  private filterSub?: Subscription;
  private citySuggestionsSub?: Subscription;

  constructor(private fetchService: FetchService,
              private translationService: TranslationService) { }

  ngOnInit() {
    this.filterSub = this.filterTrigger$
      .pipe(debounceTime(150))
      .subscribe(() => this.applyFilters());

    this.citySuggestionsSub = this.citySuggestionsTrigger$
      .pipe(
        debounceTime(150),
        distinctUntilChanged((previous, current) =>
          previous.trim().toLowerCase() === current.trim().toLowerCase()
        )
      )
      .subscribe((query) => this.updateCitySuggestions(query));

    this.fetchService.getProviders().subscribe((providers: Provider[]) => {
      this.providers = providers || [];
      this.rebuildProviderSearchRows();
      this.providerTypeOptions = Array.from(new Set(
        this.providers
          .map(provider => provider?.type?.trim())
          .filter((type): type is string => !!type)
      )).sort((a, b) => a.localeCompare(b));
      this.applyFilters();
    });
  }

  ngOnDestroy() {
    this.filterSub?.unsubscribe();
    this.citySuggestionsSub?.unsubscribe();
  }

  onSearchQueryChange(query: string | null | undefined) {
    this.searchQuery = query || '';
    this.filterTrigger$.next();
  }

  onSearchLocationChange(location: string | null | undefined) {
    const value = location || '';
    this.searchLocation = value;

    if (!value.trim()) {
      this.selectedCity = '';
      this.citySuggestions = [];
      this.showCitySuggestions = false;
      this.filterTrigger$.next();
      return;
    }

    if (this.selectedCity && this.selectedCity.trim().toLowerCase() === value.trim().toLowerCase()) {
      return;
    }

    this.selectedCity = '';
    this.citySuggestionsTrigger$.next(value);
    this.filterTrigger$.next();
  }

  selectCity(city: string) {
    this.selectedCity = city;
    this.searchLocation = city;
    this.citySuggestions = [];
    this.showCitySuggestions = false;
    this.filterTrigger$.next();
  }

  onProviderTypeChange(type: string | null | undefined) {
    this.selectedProviderType = type || '';
    this.filterTrigger$.next();
  }

  formatProviderType(type: string): string {
    return this.translationService.translate(`provider.type.${type}`);
  }

  private updateCitySuggestions(query: string) {
    const normalized = query.trim().toLowerCase();
    if (normalized.length < 2) {
      this.citySuggestions = [];
      this.showCitySuggestions = false;
      return;
    }

    const uniqueCities = new Map<string, string>();
    for (const row of this.providerSearchRows) {
      if (row.city.includes(normalized) && !uniqueCities.has(row.city)) {
        uniqueCities.set(row.city, row.cityLabel);
      }
    }

    this.citySuggestions = Array.from(uniqueCities.values()).slice(0, 10);
    this.showCitySuggestions = this.citySuggestions.length > 0;
  }

  private applyFilters() {
    const query = this.searchQuery.trim().toLowerCase();
    const selectedCity = this.selectedCity.trim().toLowerCase();
    const selectedProviderType = this.selectedProviderType.trim().toLowerCase();

    this.filteredProviders = this.providerSearchRows
      .filter((row) => {
        const cityMatch = !selectedCity || row.city === selectedCity;
        const typeMatch = !selectedProviderType || row.type === selectedProviderType;
        const queryMatch = !query || row.searchText.includes(query);
        return cityMatch && typeMatch && queryMatch;
      })
      .map((row) => row.provider);
  }

  private rebuildProviderSearchRows() {
    this.providerSearchRows = (this.providers || []).map((provider) => {
      const cityLabel = provider?.address?.city?.trim() || '';
      const serviceNames = (provider?.services || [])
        .map((service) => (service?.name || '').trim())
        .filter(Boolean);

      return {
        provider,
        city: cityLabel.toLowerCase(),
        cityLabel,
        type: (provider?.type || '').trim().toLowerCase(),
        searchText: [
          provider?.name || '',
          provider?.description || '',
          ...serviceNames
        ].join(' ').toLowerCase()
      };
    });
  }
}
