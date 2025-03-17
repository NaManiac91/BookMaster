import {Component} from '@angular/core';
import {Provider, Service} from "../../../shared/rest-api-client";
import {ClientService} from "../../services/client-service/client.service";
import {SecurityService} from "../../../shared/services/security/security.service";
import {NavController} from "@ionic/angular";

@Component({
  selector: 'app-reservation-workflow',
  templateUrl: './reservation-workflow.component.html',
  styleUrls: ['./reservation-workflow.component.scss'],
})
export class ReservationWorkflowComponent {
  currentProvider!: Provider;
  currentService!: Service;
  slots: string[] = [];

  constructor(private clientService: ClientService,
              private securityService: SecurityService,
              private navCtrl: NavController) { }

  serviceSelected(service: Service) {
    this.currentService = service;
    this.clientService.getAvailableTimeSlots(this.currentProvider.providerId).subscribe(slots => this.slots = slots);
  }

  addReservation(slotIndex: number) {
    const slot = [];
    for (let index = 0; index < this.currentService.time; index++) {
      slot.push(this.slots[slotIndex + index]);
    }

    const params: any = {
      date: new Date(),
      slots: slot.join(','),
      userId: this.securityService.loggedUser.userId,
      serviceId: this.currentService.serviceId,
      providerId: this.currentProvider.providerId,
      note: 'Simple reservation'
    }

    this.clientService.createReservation(params).subscribe(reservation => {
      const user = this.securityService.loggedUser;
      user.reservations.push(reservation);
      this.securityService.loggedUser = user;
      this.navCtrl.navigateRoot('');
    });
  }
}
