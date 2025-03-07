import {Component} from '@angular/core';
import {Provider, Service} from "../../../shared/rest-api-client";
import {ClientService} from "../../services/client-service/client.service";

@Component({
  selector: 'app-reservation-workflow',
  templateUrl: './reservation-workflow.component.html',
  styleUrls: ['./reservation-workflow.component.scss'],
})
export class ReservationWorkflowComponent {
  currentProvider!: Provider;
  currentService!: Service;
  slots: string[] = [];

  constructor(private clientService: ClientService) { }

  serviceSelected(service: Service) {
    this.currentService = service;
    this.clientService.getAvailableTimeSlots(this.currentProvider.providerId).subscribe(slots => this.slots = slots);
  }
}
