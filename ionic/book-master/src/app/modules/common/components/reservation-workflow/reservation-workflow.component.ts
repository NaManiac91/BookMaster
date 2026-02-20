import {Component, OnDestroy, OnInit} from '@angular/core';
import {Provider, Reservation, Service} from "../../../shared/rest-api-client";
import {ClientService} from "../../services/client-service/client.service";
import {AuthService} from "../../../shared/services/auth/auth.service";
import {AlertController, NavController} from "@ionic/angular";
import {ObjectProfileView} from "../../../shared/enum";
import {Router} from "@angular/router";
import {FetchService} from "../../services/fetch-service/fetch.service";
import {TranslationService} from "../../../shared/modules/translation/services/translation.service";
import {Subscription} from "rxjs";
import {
  availabilityRatioToDotLevel,
  calculateMaxSlotsPerDay,
  CalendarDayCell,
  CalendarDotLevel,
  resolveLocale,
  toISODateString
} from "../../../shared/utils/date-time.utils";
import {readNavigationState} from "../../../shared/utils/navigation-state.utils";

type WorkflowStep = 'provider' | 'service' | 'slots' | 'summary';
type AvailabilityLevel = 'none' | 'low' | 'medium' | 'high';

@Component({
  selector: 'app-reservation-workflow',
  templateUrl: './reservation-workflow.component.html',
  styleUrls: ['./reservation-workflow.component.scss'],
})
export class ReservationWorkflowComponent implements OnInit, OnDestroy {
  currentProvider!: Provider;
  currentService!: Service;
  reservationPreview?: Reservation;
  slots: { [key: string]: string[] } = {};
  availabilityByDate: { [key: string]: number } = {};
  calendarDotLevelsByDate: Record<string, CalendarDotLevel> = {};
  currentDay: Date = new Date();
  currentCalendarMonth: Date = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  readonly todayIsoDate: string = toISODateString(new Date());
  readonly weekDayKeys: string[] = [
    'weekday.mon',
    'weekday.tue',
    'weekday.wed',
    'weekday.thu',
    'weekday.fri',
    'weekday.sat',
    'weekday.sun'
  ];
  selectedCalendarDate: string = this.todayIsoDate;
  currentLocale: string = 'en-US';
  readonly providerInfoView = ObjectProfileView.INFO;
  readonly reservationConsultView = ObjectProfileView.CREATE;
  currentStep: WorkflowStep = 'provider';
  private languageSub?: Subscription;

  constructor(private clientService: ClientService,
              private authService: AuthService,
              private navCtrl: NavController,
              private router: Router,
              private fetchService: FetchService,
              private translationService: TranslationService,
              private alertController: AlertController) { }

  ngOnInit() {
    this.currentLocale = resolveLocale(this.translationService.currentLanguage);
    this.languageSub = this.translationService.language$.subscribe(language => {
      this.currentLocale = resolveLocale(language);
    });

    const navigationState = readNavigationState<{provider?: Provider; service?: Service}>(this.router);
    const provider = navigationState.provider as Provider;
    const service = navigationState.service as Service;
    if (provider) {
      this.providerSelected(provider);
      this.fetchService.getProviderById(provider.providerId).subscribe((fullProvider: Provider) => {
        this.currentProvider = Object.assign(new Provider(), fullProvider);
        this.currentProvider.services = (fullProvider.services || []).map(s => Object.assign(new Service(), s));

        if (service) {
          const fullService = (this.currentProvider.services || [])
            .find(s => s.serviceId === service.serviceId);
          this.serviceSelected(fullService ? fullService : Object.assign(new Service(), service));
        }
      });
    }
  }

  get stepLabel(): string {
    switch (this.currentStep) {
      case 'provider': return this.translationService.translate('reservationWorkflow.step.provider');
      case 'service': return this.translationService.translate('reservationWorkflow.step.service');
      case 'slots': return this.translationService.translate('reservationWorkflow.step.slots');
      case 'summary': return this.translationService.translate('reservationWorkflow.step.summary');
      default: return '';
    }
  }

  get canGoBack(): boolean {
    return this.currentStep !== 'provider';
  }

  goBack() {
    if (this.currentStep === 'slots') {
      this.currentStep = 'service';
      return;
    }

    if (this.currentStep === 'summary') {
      this.currentStep = 'slots';
      return;
    }

    if (this.currentStep === 'service') {
      this.currentStep = 'provider';
      this.currentService = undefined as unknown as Service;
      this.reservationPreview = undefined;
      this.slots = {};
    }
  }

  providerSelected(provider: Provider) {
    this.currentProvider = Object.assign(new Provider(), provider);
    this.currentService = undefined as unknown as Service;
    this.reservationPreview = undefined;
    this.slots = {};
    this.availabilityByDate = {};
    this.calendarDotLevelsByDate = {};
    this.currentDay = new Date();
    this.currentCalendarMonth = new Date(this.currentDay.getFullYear(), this.currentDay.getMonth(), 1);
    this.selectedCalendarDate = toISODateString(this.currentDay);
    this.currentStep = 'service';
  }

  serviceSelected(service: Service) {
    this.currentService = service;
    this.reservationPreview = undefined;
    this.currentStep = 'slots';
    this.currentCalendarMonth = new Date(this.currentDay.getFullYear(), this.currentDay.getMonth(), 1);
    this.selectedCalendarDate = toISODateString(this.currentDay);
    this.loadAvailabilitySummaryForCurrentMonth();
    this.loadAvailableSlots(this.currentDay);
  }

  changeMonth(offset: number) {
    if (!this.currentProvider || this.currentStep !== 'slots') {
      return;
    }
    this.currentCalendarMonth = new Date(
      this.currentCalendarMonth.getFullYear(),
      this.currentCalendarMonth.getMonth() + offset,
      1
    );
    this.loadAvailabilitySummaryForCurrentMonth();
  }

  selectCalendarDay(dayCell: CalendarDayCell) {
    if (!dayCell.selectable || !this.currentProvider || this.currentStep !== 'slots') {
      return;
    }
    this.currentDay = new Date(dayCell.date);
    this.selectedCalendarDate = dayCell.isoDate;
    this.loadAvailableSlots(dayCell.date);
  }

  async addReservation(slotDay: string, slotIndex: number) {
    const requiredSlots = this.getRequiredSlots();
    const daySlots = this.slots[slotDay] || [];
    const selectedSlots = daySlots.slice(slotIndex, slotIndex + requiredSlots).filter(Boolean);

    if (selectedSlots.length < requiredSlots) {
      const alert = await this.alertController.create({
        message: this.translationService.translate('reservationWorkflow.insufficientSlots'),
        buttons: [this.translationService.translate('common.ok')],
      });
      await alert.present();
      return;
    }

    this.reservationPreview = Object.assign(new Reservation(), {
      date: new Date(slotDay),
      slots: selectedSlots.join(','),
      providerName: this.currentProvider.name,
      providerTimeBlockMinutes: this.currentProvider.timeBlockMinutes,
      service: this.currentService,
      providerId: this.currentProvider.providerId
    });

    this.currentStep = 'summary';
  }

  confirmReservation() {
    if (!this.reservationPreview) {
      return;
    }

    const params: any = {
      date: this.reservationPreview.date,
      slots: this.reservationPreview.slots,
      userId: this.authService.loggedUser.userId,
      serviceId: this.currentService.serviceId,
      providerId: this.currentProvider.providerId,
      note: this.reservationPreview.note
    }

    this.clientService.createReservation(params).subscribe(reservation => {
      const user = this.authService.loggedUser;
      user.reservations.push(reservation);
      this.authService.loggedUser = user;
      this.navCtrl.navigateRoot('');
    });
  }

  get currentMonthLabel(): string {
    return this.currentCalendarMonth.toLocaleDateString(this.currentLocale, { month: 'long', year: 'numeric' });
  }

  get canGoToPreviousMonth(): boolean {
    const currentMonthStart = new Date(this.currentCalendarMonth.getFullYear(), this.currentCalendarMonth.getMonth(), 1);
    const todayMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    return currentMonthStart > todayMonthStart;
  }

  hasRequiredConsecutiveSlots(slotDay: string, slotIndex: number): boolean {
    const requiredSlots = this.getRequiredSlots();
    const daySlots = this.slots[slotDay] || [];
    return daySlots.slice(slotIndex, slotIndex + requiredSlots).filter(Boolean).length === requiredSlots;
  }

  private getRequiredSlots(): number {
    const required = Number(this.currentService?.time);
    return Number.isFinite(required) && required > 0 ? required : 1;
  }

  private loadAvailableSlots(day: Date) {
    this.clientService.getAvailableTimeSlots(this.currentProvider.providerId, day).subscribe(slots => this.slots = slots);
  }

  private loadAvailabilitySummaryForCurrentMonth() {
    if (!this.currentProvider) {
      this.availabilityByDate = {};
      this.calendarDotLevelsByDate = {};
      return;
    }

    const fromDate = new Date(this.currentCalendarMonth.getFullYear(), this.currentCalendarMonth.getMonth(), 1);
    const toDate = new Date(this.currentCalendarMonth.getFullYear(), this.currentCalendarMonth.getMonth() + 1, 0);
    this.clientService.getAvailabilitySummary(this.currentProvider.providerId, fromDate, toDate)
      .subscribe(summary => {
        this.availabilityByDate = summary || {};
        this.calendarDotLevelsByDate = this.buildCalendarDotLevels(this.availabilityByDate);
      });
  }

  private buildCalendarDotLevels(summaryByDate: Record<string, number>): Record<string, CalendarDotLevel> {
    const levels: Record<string, CalendarDotLevel> = {};
    for (const isoDate of Object.keys(summaryByDate || {})) {
      levels[isoDate] = this.toAvailabilityLevel(summaryByDate[isoDate]);
    }
    return levels;
  }

  private toAvailabilityLevel(availableCount: number): AvailabilityLevel {
    if (availableCount == null) {
      return 'none';
    }

    const requiredSlots = this.getRequiredSlots();
    if (availableCount < requiredSlots) {
      return 'none';
    }

    const maxSlotsPerDay = calculateMaxSlotsPerDay(
      this.currentProvider?.startTime,
      this.currentProvider?.endTime,
      Number(this.currentProvider?.timeBlockMinutes)
    );
    if (maxSlotsPerDay <= 0) {
      if (availableCount < requiredSlots * 2) {
        return 'low';
      }
      if (availableCount < requiredSlots * 4) {
        return 'medium';
      }
      return 'high';
    }

    const availabilityRatio = Math.min(1, Math.max(0, availableCount / maxSlotsPerDay));
    return availabilityRatioToDotLevel(availabilityRatio);
  }

  ngOnDestroy(): void {
    this.languageSub?.unsubscribe();
  }

}
