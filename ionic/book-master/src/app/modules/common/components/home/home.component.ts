import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { NavController } from "@ionic/angular";
import { Subject, Subscription, of } from "rxjs";
import { catchError, debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";
import { IModel, Provider, Reservation, Service, User } from 'src/app/modules/shared/rest-api-client';
import { AuthService } from 'src/app/modules/shared/services/auth/auth.service';
import { CalendarDotLevel, CalendarDayCell, resolveLocale, toISODateString } from "../../../shared/utils/date-time.utils";
import { readNavigationState } from "../../../shared/utils/navigation-state.utils";
import { FetchService } from "../../services/fetch-service/fetch.service";
import { ProviderReservationCalendarService } from "../../services/provider-reservation-calendar/provider-reservation-calendar.service";
import {
  normalizeProviderClosedDates,
  normalizeProviderClosedDays,
  toClosedWeekdayJsIndexes
} from "../../../shared/utils/provider-weekday.utils";

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
  currentLocale: string = 'en-US';
  readonly weekDayKeys: string[] = [
    'weekday.mon',
    'weekday.tue',
    'weekday.wed',
    'weekday.thu',
    'weekday.fri',
    'weekday.sat',
    'weekday.sun'
  ];
  readonly todayIsoDate: string = toISODateString(new Date());
  providerSelectedDate: string = this.todayIsoDate;
  providerCalendarMonth: Date = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  providerDotLevelsByDate: Record<string, CalendarDotLevel> = {};
  providerCalendarDefaultDotLevel: CalendarDotLevel = 'none';
  providerClosedWeekDays: number[] = [];
  providerClosedDatesIso: string[] = [];
  searchMode: SearchMode = 'provider';
  searchQuery = '';
  searchLocation = '';
  selectedCity = '';
  citySuggestions: string[] = [];
  showCitySuggestions = false;
  providerResults: Provider[] = [];
  serviceResults: ServiceSearchResult[] = [];
  isSearching = false;

  private search$ = new Subject<{ query: string, mode: SearchMode, location: string }>();
  private citySearch$ = new Subject<string>();
  private searchSub?: Subscription;
  private citySearchSub?: Subscription;
  private activatedRoute = inject(ActivatedRoute);

  constructor(private authService: AuthService,
              private fetchService: FetchService,
              private providerReservationCalendarService: ProviderReservationCalendarService,
              private router: Router,
              private navCtrl: NavController) {
  }

  ngOnInit() {
    const navigationState = readNavigationState<{ object?: IModel }>(this.router);
    const object = (navigationState.object as IModel) || this.activatedRoute.snapshot.queryParams['object'];

    this.initUser(this.authService.loggedUser, object);
    this.currentLocale = resolveLocale(this.user?.language);
    this.initializeProviderCalendar();
    if (!this.isProviderUser) {
      this.initSearchSubscriptions();
    }
  }

  ngOnDestroy() {
    this.searchSub?.unsubscribe();
    this.citySearchSub?.unsubscribe();
  }

  get isProviderUser(): boolean {
    return !!this.provider;
  }

  get roleLabelKey(): string {
    return this.isProviderUser ? 'home.role.provider' : 'home.role.customer';
  }

  get providerCurrentMonthLabel(): string {
    return this.providerCalendarMonth.toLocaleDateString(this.currentLocale, { month: 'long', year: 'numeric' });
  }

  get canGoToPreviousProviderMonth(): boolean {
    const currentMonthStart = new Date(this.providerCalendarMonth.getFullYear(), this.providerCalendarMonth.getMonth(), 1);
    const todayMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    return currentMonthStart > todayMonthStart;
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

  goToProviderAdmin() {
    this.navCtrl.navigateRoot('ProviderAdmin');
  }

  changeProviderMonth(offset: number) {
    if (!this.isProviderUser) {
      return;
    }

    this.providerCalendarMonth = new Date(
      this.providerCalendarMonth.getFullYear(),
      this.providerCalendarMonth.getMonth() + offset,
      1
    );
  }

  selectProviderReservationDay(dayCell: CalendarDayCell) {
    if (!dayCell || !dayCell.selectable || !this.isProviderUser) {
      return;
    }

    this.providerSelectedDate = dayCell.isoDate;
  }

  onProviderReservationRemoved() {
    if (!this.isProviderUser) {
      return;
    }

    this.refreshProviderReservationCalendarData();
  }

  openReservationByProvider(provider: Provider) {
    if (this.isProviderUser) {
      return;
    }

    this.navCtrl.navigateRoot('ReservationWorkflow', {
      state: {
        provider
      }
    });
  }

  openReservationByService(result: ServiceSearchResult) {
    if (this.isProviderUser) {
      return;
    }

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

  onSearchModeChange(value: SearchMode) {
    this.searchMode = value;
    this.runSearchIfReady();
  }

  private initSearchSubscriptions() {
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
              results.push({ provider, service });
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

  private initUser(user: User, object: IModel) {
    // Prefer navigation state when present (after create/edit), fallback to session user.
    const candidateUser = object && object.$t === User.$t ? object as User : user;
    this.user = Object.assign(new User(), candidateUser);
    this.user.reservations = (candidateUser?.reservations || [])
      .map(reservation => Object.assign(new Reservation(), reservation));

    if (this.user.provider) {
      const provider = object && object.$t === Provider.$t ? object : this.user.provider;
      this.provider = this.user.provider = Object.assign(new Provider(), provider as Provider);
      this.provider.services = (this.provider.services || []).map((service: Service) => Object.assign(new Service(), service));
      // Normalize closure data once and expose both formats needed by status-calendar.
      this.provider.closedDays = normalizeProviderClosedDays(this.provider.closedDays);
      this.provider.closedDates = normalizeProviderClosedDates(this.provider.closedDates);
      this.providerClosedWeekDays = toClosedWeekdayJsIndexes(this.provider.closedDays);
      this.providerClosedDatesIso = [...this.provider.closedDates];
    } else {
      this.provider = undefined as unknown as Provider;
      this.providerClosedWeekDays = [];
      this.providerClosedDatesIso = [];
    }

    this.authService.loggedUser = this.user;
  }

  private initializeProviderCalendar() {
    if (!this.isProviderUser) {
      return;
    }

    this.providerSelectedDate = this.todayIsoDate;
    this.providerCalendarMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    this.refreshProviderReservationCalendarData();
  }

  private refreshProviderReservationCalendarData() {
    const reservations = this.user?.reservations || [];
    const calendar = this.providerReservationCalendarService.buildAvailabilityLevels(reservations, this.provider);
    this.providerDotLevelsByDate = calendar.dotLevelsByDate;
    this.providerCalendarDefaultDotLevel = calendar.defaultDotLevel;
  }

  private runSearchIfReady() {
    const normalizedQuery = this.searchQuery.trim();
    const normalizedLocationInput = this.searchLocation.trim();
    const normalizedSelectedCity = this.selectedCity.trim();

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
