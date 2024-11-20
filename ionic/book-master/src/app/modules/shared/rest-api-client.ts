/* tslint:disable */
/* eslint-disable */
// Generated using typescript-generator version 2.22.595 on 2024-11-19 14:46:41.

export interface Provider extends Serializable, IModel {
    address: string;
    description: string;
    email: string;
    name: string;
    phone: string;
    providerId: string;
    services: Service[];
    type: string;
}

export interface Service extends Serializable, IModel {
    description: string;
    name: string;
    price: number;
    provider: Provider;
    serviceId: string;
    tags: string[];
    time: number;
}

export interface Reservation extends Serializable, IModel {
    date: Date;
    note: string;
    reservationId: string;
    service: Service;
    user: User;
}

export interface User extends Serializable, IModel {
    email: string;
    firstName: string;
    lastName: string;
    reservations: Reservation[];
    userId: string;
    username: string;
}

export interface Serializable {
}

export interface IModel {
}
