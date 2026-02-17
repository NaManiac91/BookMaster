import {Component, OnInit} from '@angular/core';
import {Provider, Reservation, Service} from "../../../shared/rest-api-client";
import {ClientService} from "../../services/client-service/client.service";
import {AuthService} from "../../../shared/services/auth/auth.service";
import {AlertController, NavController} from "@ionic/angular";
import {ObjectProfileView} from "../../../shared/enum";
import {Router} from "@angular/router";
import {FetchService} from "../../services/fetch-service/fetch.service";

type WorkflowStep = 'provider' | 'service' | 'slots' | 'summary';

@Component({
  selector: 'app-reservation-workflow',
  templateUrl: './reservation-workflow.component.html',
  styleUrls: ['./reservation-workflow.component.scss'],
})
export class ReservationWorkflowComponent implements OnInit {
  currentProvider!: Provider;
  currentService!: Service;
  reservationPreview?: Reservation;
  slots: { [key: string]: string[] } = {};
  currentDay: Date = new Date();
  readonly todayIsoDate: string = this.toISODateString(new Date());
  selectedCalendarDate: string = this.todayIsoDate;
  readonly providerInfoView = ObjectProfileView.INFO;
  readonly reservationConsultView = ObjectProfileView.CREATE;
  currentStep: WorkflowStep = 'provider';

  constructor(private clientService: ClientService,
              private authService: AuthService,
              private navCtrl: NavController,
              private router: Router,
              private fetchService: FetchService,
              private alertController: AlertController) { }

  ngOnInit() {
    const currentNavigation = this.router.getCurrentNavigation();
    const provider = currentNavigation?.extras?.state?.['provider'] as Provider;
    const service = currentNavigation?.extras?.state?.['service'] as Service;
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
      case 'provider': return 'Provider';
      case 'service': return 'Lista dei Servizi Disponibili';
      case 'slots': return 'Orari';
      case 'summary': return 'Riepilogo Prenotazione';
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
    this.currentDay = new Date();
    this.selectedCalendarDate = this.toISODateString(this.currentDay);
    this.currentStep = 'service';
  }

  serviceSelected(service: Service) {
    this.currentService = service;
    this.reservationPreview = undefined;
    this.currentStep = 'slots';
    this.selectedCalendarDate = this.toISODateString(this.currentDay);
    this.loadAvailableSlots(this.currentDay);
  }

  onCalendarDateChange(event: Event) {
    const value = (event.target as HTMLInputElement)?.value;
    if (!value || !this.currentProvider || this.currentStep !== 'slots') {
      return;
    }

    const selectedDate = this.fromISODate(value);
    this.currentDay = selectedDate;
    this.selectedCalendarDate = this.toISODateString(selectedDate);
    this.loadAvailableSlots(selectedDate);
  }

  async addReservation(slotDay: string, slotIndex: number) {
    const requiredSlots = this.getRequiredSlots();
    const daySlots = this.slots[slotDay] || [];
    const selectedSlots = daySlots.slice(slotIndex, slotIndex + requiredSlots).filter(Boolean);

    if (selectedSlots.length < requiredSlots) {
      const alert = await this.alertController.create({
        message: 'Gli slot consecutivi disponibili non sono sufficienti per la durata del servizio.',
        buttons: ['OK'],
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

  update(offset: number) {
    const newDay = new Date(this.currentDay);
    newDay.setDate(newDay.getDate() + offset);
    this.currentDay = newDay;
    this.selectedCalendarDate = this.toISODateString(newDay);
    this.loadAvailableSlots(newDay);
  }

  isNotToday(date: string): boolean {
    return new Date().toDateString() !== new Date(date).toDateString();
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

  private toISODateString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private fromISODate(value: string): Date {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
  }
}
