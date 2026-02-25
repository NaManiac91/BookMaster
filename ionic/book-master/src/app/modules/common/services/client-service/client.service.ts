import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Reservation} from "../../../shared/rest-api-client";
import {Observable, map} from 'rxjs';
import {toISODateString} from "../../../shared/utils/date-time.utils";

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
    const params = new HttpParams()
      .set('providerId', providerId)
      .set('date', toISODateString(date));

    return <Observable<{ [key: string]: string[] }>>this.httpClient.get(this.api + 'getAvailableTimeSlots', { params });
  }

  getAvailabilitySummary(providerId: string, from: Date, to: Date): Observable<{ [key: string]: number }> {
    const params = new HttpParams()
      .set('providerId', providerId)
      .set('from', toISODateString(from))
      .set('to', toISODateString(to));

    return <Observable<{ [key: string]: number }>>this.httpClient.get(
      this.api + 'getAvailabilitySummary',
      { params }
    );
  }

  removeReservation(reservationId: string): Observable<boolean> {
    const params = new HttpParams().set('reservationId', reservationId);
    return <Observable<boolean>>this.httpClient.get(this.api + 'removeReservation', { params });
  }

  getReservationHistory(userId: string): Observable<Reservation[]> {
    const params = new HttpParams().set('userId', userId);
    return <Observable<Reservation[]>>this.httpClient.get<any[]>(this.api + 'getReservationHistory', { params })
      .pipe(map((reservations: any[]) => (reservations || []).map(r => Object.assign(new Reservation(), r))));
  }
}
