import {Component, Input} from '@angular/core';
import {Reservation} from 'src/app/modules/shared/rest-api-client';
import {ClientService} from "../../../../../../common/services/client-service/client.service";
import {AlertController} from "@ionic/angular";

@Component({
  selector: 'app-reservations-list',
  templateUrl: './reservations-list.component.html',
  styleUrls: ['./reservations-list.component.scss'],
})
export class ReservationsListComponent {
  @Input() list: Reservation[] = [];

  constructor(private clientService: ClientService,
              private alertController: AlertController) { }

  remove(reservationId: string, index: number) {
    this.clientService.removeReservation(reservationId).subscribe(async removed => {
      if (removed) {
        this.list.splice(index, 1);

        const alert = await this.alertController.create({
          message: 'Reservation removed successfully.',
          buttons: ['OK'],
        });

        await alert.present();
      }
    });
  }
}
