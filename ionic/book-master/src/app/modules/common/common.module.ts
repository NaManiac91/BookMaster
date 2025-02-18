import { NgModule } from '@angular/core';
import { FetchService } from './services/fetch-service/fetch.service';
import { SharedModule } from '../shared/shared.module';
import { ObjectProfileComponent } from './object-profile/components/object-profile.component';
import { HomeComponent } from './components/home/home.component';
import { ModalInfoComponent } from './components/modal/modal-info/modal-info.component';
import { ReservationsListComponent } from './components/list/reservations-list/reservations-list.component';
import {ObjectProfileService} from "./object-profile/services/object-profile.service";
import {ComponentLoaderComponent} from "./object-profile/components/component-loader.component";
import {ProvidersListComponent} from "./components/list/providers-list/providers-list.component";
import {ServicesListComponent} from "./components/list/services-list/services-list.component";
import {ClientService} from "./services/client-service/client.service";

const components = [
  ObjectProfileComponent,
  HomeComponent,
  ModalInfoComponent,
  ReservationsListComponent,
  ComponentLoaderComponent,
  ProvidersListComponent,
  ServicesListComponent
];

const services = [
  FetchService,
  ObjectProfileService,
  ClientService
];

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: components,
  exports: components,
  providers: services
})
export class CommonModule {}
