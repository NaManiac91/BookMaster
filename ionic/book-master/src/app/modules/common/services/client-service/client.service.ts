import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Reservation} from "../../../shared/rest-api-client";
import {Observable, map} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private readonly api = 'api/client/';

  constructor(private httpClient: HttpClient) { }

  createReservation(reservation: Reservation): Observable<Reservation> {
    return <Observable<Reservation>>this.httpClient.post(this.api + 'createReservation', reservation)
      .pipe(map(reservation => Object.assign(new Reservation(), reservation)));
  }

  getAvailableTimeSlots(providerId: string): Observable<string[]> {
    return <Observable<string[]>>this.httpClient.get(this.api + 'getAvailableTimeSlots?providerId=' + providerId + '&date=2025-02-25');
  }
}
