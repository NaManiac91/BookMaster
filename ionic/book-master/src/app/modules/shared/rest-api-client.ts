/* tslint:disable */
/* eslint-disable */

// Generated using typescript-generator version 2.22.595 on 2025-03-11 11:43:27.

import {Initializer} from "./services/model-initializer/model-initializer.service";

@Initializer('IModel', IModel)
export class IModel {
  readonly $t: string = 'IModel';
}

export class Address  {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

@Initializer('Provider', Provider)
export class Provider extends IModel {
  providerId: string;
  name: string;
  description: string;
  address: Address;
  email: string;
  phone: string;
  type: string;
  startTime: Date;
  endTime: Date;
  timeBlockMinutes: number;
  services: Service[];
  override readonly $t: string = 'Provider';
  static $t: string = 'Provider';
}

@Initializer('Reservation', Reservation)
export class Reservation extends IModel {
  reservationId: string;
  date: Date;
  slots: string;
  note: string;
  providerName: string;
  providerTimeBlockMinutes: number;
  listSlot: string[];
  service: Service;
  users: User[];
  providerId: string;
  override readonly $t: string = 'Reservation';
  static $t: string = 'Reservation';
}

@Initializer('Service', Service)
export class Service extends IModel {
  serviceId: string;
  name: string;
  description: string;
  tags: string[];
  price: number;
  time: number;
  reservations: Reservation[];
  override readonly $t: string = 'Service';
  static $t: string = 'Service';
}

@Initializer('User', User)
export class User extends IModel {
  userId: string;
  username: string;
  email: string;
  lastName: string;
  firstName: string;
  reservations: Reservation[];
  provider: Provider;
  override readonly $t: string = 'User';
  static $t: string = 'User';
}
