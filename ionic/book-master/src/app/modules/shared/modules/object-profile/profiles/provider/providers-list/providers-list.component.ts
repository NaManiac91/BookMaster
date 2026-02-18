import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FetchService} from "../../../../../../common/services/fetch-service/fetch.service";
import {Provider} from "../../../../../rest-api-client";
import {ObjectProfile} from "../../../services/object-profile.service";
import {ObjectProfileView} from "../../../../../enum";
import {TranslationService} from "../../../../translation/services/translation.service";

@ObjectProfile({
  view: ObjectProfileView.LIST,
  type: Provider
})
@Component({
  selector: 'app-providers-list',
  templateUrl: './providers-list.component.html',
  styleUrls: ['./providers-list.component.scss'],
})
export class ProvidersListComponent implements OnInit {
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

  constructor(private fetchService: FetchService,
              private translationService: TranslationService) { }

  ngOnInit() {
    this.fetchService.getProviders().subscribe((providers: Provider[]) => {
      this.providers = providers || [];
      this.providerTypeOptions = Array.from(new Set(
        this.providers
          .map(provider => provider?.type?.trim())
          .filter((type): type is string => !!type)
      )).sort((a, b) => a.localeCompare(b));
      this.filteredProviders = this.providers;
    });
  }

  onSearchQueryChange(query: string | null | undefined) {
    this.searchQuery = query || '';
    this.applyFilters();
  }

  onSearchLocationChange(location: string | null | undefined) {
    const value = location || '';
    this.searchLocation = value;

    if (!value.trim()) {
      this.selectedCity = '';
      this.citySuggestions = [];
      this.showCitySuggestions = false;
      this.applyFilters();
      return;
    }

    if (this.selectedCity && this.selectedCity.trim().toLowerCase() === value.trim().toLowerCase()) {
      return;
    }

    this.selectedCity = '';
    this.updateCitySuggestions(value);
    this.applyFilters();
  }

  selectCity(city: string) {
    this.selectedCity = city;
    this.searchLocation = city;
    this.citySuggestions = [];
    this.showCitySuggestions = false;
    this.applyFilters();
  }

  onProviderTypeChange(type: string | null | undefined) {
    this.selectedProviderType = type || '';
    this.applyFilters();
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
    for (const provider of this.providers) {
      const city = provider?.address?.city?.trim();
      if (!city) {
        continue;
      }
      const key = city.toLowerCase();
      if (key.includes(normalized) && !uniqueCities.has(key)) {
        uniqueCities.set(key, city);
      }
    }

    this.citySuggestions = Array.from(uniqueCities.values()).slice(0, 10);
    this.showCitySuggestions = this.citySuggestions.length > 0;
  }

  private applyFilters() {
    const query = this.searchQuery.trim().toLowerCase();
    const selectedCity = this.selectedCity.trim().toLowerCase();
    const selectedProviderType = this.selectedProviderType.trim().toLowerCase();

    this.filteredProviders = this.providers.filter((provider: Provider) => {
      const providerCity = provider?.address?.city?.trim().toLowerCase() || '';
      const cityMatch = !selectedCity || providerCity === selectedCity;
      const providerType = (provider?.type || '').trim().toLowerCase();
      const typeMatch = !selectedProviderType || providerType === selectedProviderType;

      if (!query) {
        return cityMatch && typeMatch;
      }

      const providerName = provider?.name?.toLowerCase() || '';
      const providerDescription = provider?.description?.toLowerCase() || '';
      const servicesMatch = (provider?.services || [])
        .some(service => (service?.name || '').toLowerCase().includes(query));

      const queryMatch = providerName.includes(query) || providerDescription.includes(query) || servicesMatch;
      return cityMatch && typeMatch && queryMatch;
    });
  }
}
