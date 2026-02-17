import {Component, Input} from '@angular/core';
import {Reservation} from 'src/app/modules/shared/rest-api-client';
import {ClientService} from "../../../../../../common/services/client-service/client.service";
import {AlertController, NavController} from "@ionic/angular";
import {ObjectProfileView} from "../../../../../enum";

@Component({
  selector: 'app-reservations-list',
  templateUrl: './reservations-list.component.html',
  styleUrls: ['./reservations-list.component.scss'],
})
export class ReservationsListComponent {
  @Input() list: Reservation[] = [];

  constructor(private clientService: ClientService,
              private alertController: AlertController,
              private navCtrl: NavController) {
  }

  get futureReservations(): Reservation[] {
    return this.list.filter(reservation => this.isFutureOrToday(reservation))
      .map(reservation => Object.assign(reservation, new Reservation()));
  }

  remove(reservationId: string) {
    this.clientService.removeReservation(reservationId).subscribe(async removed => {
      if (removed) {
        const index = this.list.findIndex(r => r.reservationId === reservationId);
        if (index >= 0) {
          this.list.splice(index, 1);
        }

        const alert = await this.alertController.create({
          message: 'Reservation removed successfully.',
          buttons: ['OK'],
        });

        await alert.present();
      }
    });
  }

  show(reservation: Reservation) {
    this.navCtrl.navigateRoot('Editor', {
      queryParams: {
        object: reservation,
        view: ObjectProfileView.CONSULT
      }
    });
  }

  private isFutureOrToday(reservation: Reservation): boolean {
    const reservationDate = new Date(reservation.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    reservationDate.setHours(0, 0, 0, 0);
    return reservationDate >= today;
  }
}
