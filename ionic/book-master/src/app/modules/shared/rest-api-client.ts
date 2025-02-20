/* tslint:disable */
/* eslint-disable */
// Generated using typescript-generator version 2.22.595 on 2024-11-19 14:46:41.

import {Initializer} from "./services/model-initializer/model-initializer.service";

export interface Serializable {
}

@Initializer('IModel', IModel)
export class IModel {
  readonly $t: string = 'IModel';
}

@Initializer('Provider', Provider)
export class Provider extends IModel implements Serializable {
  address!: string;
  description!: string;
  email!: string;
  name!: string;
  phone!: string;
  providerId!: string;
  services!: Service[];
  type!: string;
  override readonly $t = 'Provider';
}

@Initializer('Service', Service)
export class Service extends IModel implements Serializable {
  description!: string;
  name!: string;
  price!: number;
  provider!: Provider;
  serviceId!: string;
  tags!: string[];
  time!: number;
  reservations!: Reservation[];
  override readonly $t = 'Service';
}

@Initializer('Reservation', Reservation)
export class Reservation extends IModel implements Serializable {
  date!: Date;
  note!: string;
  reservationId!: string;
  service!: Service;
  user!: User;
  providerName!: string;
  serviceName!: string;
  override readonly $t = 'Reservation';
}

@Initializer('User', User)
export class User extends IModel implements Serializable {
  email!: string;
  firstName!: string;
  lastName!: string;
  provider!: Provider;
  reservations!: Reservation[];
  userId!: string;
  username!: string;
  override readonly $t = 'User';
}
