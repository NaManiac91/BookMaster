/* tslint:disable */
/* eslint-disable */
// Generated using typescript-generator version 2.22.595 on 2024-11-19 14:46:41.

export interface Serializable {
}

export class IModel {
  readonly $t: string = 'IModel';
}

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

export class Service extends IModel implements Serializable {
    description!: string;
    name!: string;
    price!: number;
    provider!: Provider;
    serviceId!: string;
    tags!: string[];
    time!: number;
  override readonly $t = 'Service';
}

export class Reservation extends IModel implements Serializable {
    date!: Date;
    note!: string;
    reservationId!: string;
    service!: Service;
    user!: User;
  override readonly $t = 'Reservation';
}

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
