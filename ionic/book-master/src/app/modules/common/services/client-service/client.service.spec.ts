import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { ClientService } from './client.service';
import { Reservation } from '../../../shared/rest-api-client';

describe('ClientService', () => {
  let service: ClientService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ClientService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(ClientService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('creates reservation and maps response to Reservation model', () => {
    const payload = { providerId: 'p1', slots: ['10:00'] };
    let result: Reservation | undefined;

    service.createReservation(payload).subscribe((reservation) => {
      result = reservation;
    });

    const req = httpMock.expectOne('api/client/createReservation');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush({ reservationId: 'r1', slots: '10:00' });

    expect(result instanceof Reservation).toBeTrue();
    expect(result?.reservationId).toBe('r1');
  });

  it('builds available slots URL with zero-padded date', () => {
    const providerId = 'provider-1';
    const date = new Date(2025, 0, 5);

    service.getAvailableTimeSlots(providerId, date).subscribe();

    const req = httpMock.expectOne((request) =>
      request.url === 'api/client/getAvailableTimeSlots'
      && request.params.get('providerId') === 'provider-1'
      && request.params.get('date') === '2025-01-05'
    );
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('calls removeReservation endpoint with reservationId', () => {
    service.removeReservation('reservation-1').subscribe();

    const req = httpMock.expectOne((request) =>
      request.url === 'api/client/removeReservation'
      && request.params.get('reservationId') === 'reservation-1'
    );
    expect(req.request.method).toBe('GET');
    req.flush(true);
  });

  it('calls reservation history endpoint and maps models', () => {
    let result: Reservation[] | undefined;

    service.getReservationHistory('u1').subscribe((reservations) => {
      result = reservations;
    });

    const req = httpMock.expectOne((request) =>
      request.url === 'api/client/getReservationHistory'
      && request.params.get('userId') === 'u1'
    );
    expect(req.request.method).toBe('GET');
    req.flush([{ reservationId: 'r1' }]);

    expect(result?.length).toBe(1);
    expect(result?.[0] instanceof Reservation).toBeTrue();
  });
});
