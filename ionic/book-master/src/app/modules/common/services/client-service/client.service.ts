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

  createReservation(params: any): Observable<Reservation> {
    return <Observable<Reservation>>this.httpClient.post(this.api + 'createReservation', params)
      .pipe(map(reservation => Object.assign(new Reservation(), reservation)));
  }

  getAvailableTimeSlots(providerId: string, date: Date): Observable<{ [key: string]: string[] }> {
    return <Observable<{ [key: string]: string[] }>>this.httpClient.get(this.api + 'getAvailableTimeSlots?providerId=' + providerId +
      `&date=${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`);
  }

  getAvailabilitySummary(providerId: string, from: Date, to: Date): Observable<{ [key: string]: number }> {
    const fromIso = `${from.getFullYear()}-${String(from.getMonth() + 1).padStart(2, '0')}-${String(from.getDate()).padStart(2, '0')}`;
    const toIso = `${to.getFullYear()}-${String(to.getMonth() + 1).padStart(2, '0')}-${String(to.getDate()).padStart(2, '0')}`;
    return <Observable<{ [key: string]: number }>>this.httpClient.get(
      this.api + `getAvailabilitySummary?providerId=${providerId}&from=${fromIso}&to=${toIso}`
    );
  }

  removeReservation(reservationId: string): Observable<boolean> {
    return <Observable<boolean>>this.httpClient.get(this.api + 'removeReservation?reservationId=' + reservationId);
  }

  getReservationHistory(userId: string): Observable<Reservation[]> {
    return <Observable<Reservation[]>>this.httpClient.get<any[]>(this.api + 'getReservationHistory?userId=' + userId)
      .pipe(map((reservations: any[]) => (reservations || []).map(r => Object.assign(new Reservation(), r))));
  }
}
