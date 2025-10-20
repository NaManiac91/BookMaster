import {Component} from '@angular/core';
import {Provider, Service} from "../../../shared/rest-api-client";
import {ClientService} from "../../services/client-service/client.service";
import {AuthService} from "../../../shared/services/auth/auth.service";
import {NavController} from "@ionic/angular";

@Component({
  selector: 'app-reservation-workflow',
  templateUrl: './reservation-workflow.component.html',
  styleUrls: ['./reservation-workflow.component.scss'],
})
export class ReservationWorkflowComponent {
  currentProvider!: Provider;
  currentService!: Service;
  slots: { [key: string]: string[] } = {};
  currentDay: Date = new Date;

  constructor(private clientService: ClientService,
              private authService: AuthService,
              private navCtrl: NavController) { }

  serviceSelected(service: Service) {
    this.currentService = service;
    this.clientService.getAvailableTimeSlots(this.currentProvider.providerId, this.currentDay).subscribe(slots => this.slots = slots);
  }

  addReservation(slotDay: string, slotIndex: number) {
    const slot = [];
    for (let index = 0; index < this.currentService.time; index++) {
      slot.push(this.slots[slotDay][slotIndex + index]);
    }

    const params: any = {
      date: new Date(slotDay),
      slots: slot.join(','),
      userId: this.authService.loggedUser.userId,
      serviceId: this.currentService.serviceId,
      providerId: this.currentProvider.providerId,
      note: 'Simple reservation'
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
    this.clientService.getAvailableTimeSlots(this.currentProvider.providerId, newDay).subscribe(slots => {
      this.slots = slots;
      this.currentDay = newDay;
    });
  }

  isNotToday(date: string): boolean {
    return new Date().toDateString() !== new Date(date).toDateString();
  }
}
