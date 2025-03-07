import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FetchService} from "../../../../common/services/fetch-service/fetch.service";
import {Provider, Reservation, Service} from "../../../rest-api-client";
import {ClientService} from "../../../../common/services/client-service/client.service";
import {SecurityService} from "../../../services/security/security.service";
import {ObjectProfile, ObjectProfileView} from "../../../../common/object-profile/services/object-profile.service";

@ObjectProfile({
  view: ObjectProfileView.List,
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

  constructor(private fetchService: FetchService,
              private clientService: ClientService,
              private securityService: SecurityService) {
  }

  ngOnInit() {
    this.fetchService.getProviders().subscribe(providers => this.providers = providers);
  }

  addReservation(service: Service) {
    const reservation: Reservation = new Reservation();
    reservation.service = service;
    reservation.date = new Date();
    reservation.user = this.securityService.loggedUser;
    reservation.note = 'Simple reservation';

    this.clientService.createReservation(reservation).subscribe(reservation => {
      this.securityService.loggedUser.reservations.push(reservation);
      this.securityService.userChange$.next(this.securityService.loggedUser);
    });
  }
}
