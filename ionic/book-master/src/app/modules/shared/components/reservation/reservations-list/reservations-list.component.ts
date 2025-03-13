import {Component, Input} from '@angular/core';
import {Reservation} from 'src/app/modules/shared/rest-api-client';

@Component({
  selector: 'app-reservations-list',
  templateUrl: './reservations-list.component.html',
  styleUrls: ['./reservations-list.component.scss'],
})
export class ReservationsListComponent {
  @Input() list: Reservation[] = [];

  constructor() { }
}
