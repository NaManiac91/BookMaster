import {Component, OnInit} from '@angular/core';
import {FetchService} from "../../../services/fetch-service/fetch.service";
import {Provider, Reservation, Service} from "../../../../shared/rest-api-client";
import {ClientService} from "../../../services/client-service/client.service";
import {SecurityService} from "../../../../shared/services/security/security.service";

@Component({
  selector: 'app-providers-list',
  templateUrl: './providers-list.component.html',
  styleUrls: ['./providers-list.component.scss'],
})
export class ProvidersListComponent  implements OnInit {
  providers: Provider[] = [];
  currentProvider! : Provider;

  hide: boolean = false;


  constructor(private fetchService: FetchService,
              private clientService: ClientService,
              private securityService: SecurityService) { }

  ngOnInit() {
    this.fetchService.getProviders().subscribe(providers => this.providers = providers);
  }

  showServices(provider: Provider) {
      this.hide = true;
      this.currentProvider = provider;
  }

  addReservation(service: Service) {
    const reservation: Reservation = new Reservation();
    reservation.service = service;
    reservation.date = new Date();
    reservation.user = this.securityService.loggedUser;
    reservation.note = 'Simple reservation';

    this.clientService.createReservation(reservation).subscribe(() => console.log('Successfully added'));
  }
}
