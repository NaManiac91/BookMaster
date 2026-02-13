import {Component, OnInit} from '@angular/core';
import {Reservation} from '../../../shared/rest-api-client';
import {AuthService} from '../../../shared/services/auth/auth.service';
import {ClientService} from "../../services/client-service/client.service";

@Component({
  selector: 'app-reservation-history',
  templateUrl: './reservation-history.component.html',
  styleUrls: ['./reservation-history.component.scss'],
})
export class ReservationHistoryComponent implements OnInit {
  pastReservations: Reservation[] = [];

  constructor(private authService: AuthService,
              private clientService: ClientService) {}

  ngOnInit() {
    const userId = this.authService.loggedUser?.userId;
    if (!userId) {
      return;
    }

    this.clientService.getReservationHistory(userId).subscribe(reservations => {
      this.pastReservations = reservations || [];
    });
  }
}
