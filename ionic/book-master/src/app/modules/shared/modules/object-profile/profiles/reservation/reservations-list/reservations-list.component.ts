import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Reservation} from 'src/app/modules/shared/rest-api-client';
import {ClientService} from "../../../../../../common/services/client-service/client.service";
import {AlertController, NavController} from "@ionic/angular";
import {ObjectProfileView} from "../../../../../enum";
import {TranslationService} from "../../../../translation/services/translation.service";
import {isFutureOrToday, toISODateString} from "../../../../../utils/date-time.utils";

@Component({
  selector: 'app-reservations-list',
  templateUrl: './reservations-list.component.html',
  styleUrls: ['./reservations-list.component.scss'],
})
export class ReservationsListComponent {
  private _list: Reservation[] = [];
  private _filterBySelectedDate: boolean = false;
  private _filterDateIso: string = '';
  private filteredReservations: Reservation[] = [];

  @Input() set list(value: Reservation[]) {
    this._list = value || [];
    this.rebuildFilteredReservations();
  }

  get list(): Reservation[] {
    return this._list;
  }

  @Input() set filterBySelectedDate(value: boolean) {
    this._filterBySelectedDate = !!value;
    this.rebuildFilteredReservations();
  }

  get filterBySelectedDate(): boolean {
    return this._filterBySelectedDate;
  }

  @Input() set filterDateIso(value: string) {
    this._filterDateIso = (value || '').trim();
    this.rebuildFilteredReservations();
  }

  get filterDateIso(): string {
    return this._filterDateIso;
  }

  @Output() reservationRemoved = new EventEmitter<string>();

  constructor(private clientService: ClientService,
              private alertController: AlertController,
              private navCtrl: NavController,
              private translationService: TranslationService) {
  }

  get futureReservations(): Reservation[] {
    return this.filteredReservations;
  }

  remove(reservationId: string) {
    this.clientService.removeReservation(reservationId).subscribe(async removed => {
      if (removed) {
        const index = this.list.findIndex(r => r.reservationId === reservationId);
        if (index >= 0) {
          this.list.splice(index, 1);
          this.rebuildFilteredReservations();
        }
        this.reservationRemoved.emit(reservationId);

        const alert = await this.alertController.create({
          message: this.translationService.translate('reservations.removedSuccess'),
          buttons: [this.translationService.translate('common.ok')],
        });

        await alert.present();
      }
    });
  }

  show(reservation: Reservation) {
    this.navCtrl.navigateRoot('Editor', {
      state: {
        object: reservation,
        view: ObjectProfileView.CONSULT
      }
    });
  }

  trackByReservationId(_: number, reservation: Reservation): string {
    return reservation.reservationId;
  }

  private rebuildFilteredReservations() {
    this.filteredReservations = this.list
      .filter((reservation: Reservation) => isFutureOrToday(reservation.date))
      .filter((reservation: Reservation) => this.matchesSelectedDate(reservation));
  }

  private matchesSelectedDate(reservation: Reservation): boolean {
    if (!this.filterBySelectedDate || !this.filterDateIso) {
      return true;
    }

    return toISODateString(new Date(reservation.date)) === this.filterDateIso;
  }
}
