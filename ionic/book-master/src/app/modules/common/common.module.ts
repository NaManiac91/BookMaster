import { NgModule } from '@angular/core';
import { FetchService } from './services/fetch-service/fetch.service';
import { SharedModule } from '../shared/shared.module';
import { ObjectProfileComponent } from './object-profile/components/object-profile.component';
import { HomeComponent } from './components/home/home.component';
import { ModalInfoComponent } from './components/modal-info/modal-info.component';
import { ReservationsListComponent } from './components/reservations-list/reservations-list.component';
import {ObjectProfileService} from "./object-profile/services/object-profile.service";
import {ComponentLoaderComponent} from "./object-profile/components/component-loader.component";
import {ProvidersListComponent} from "./components/providers-list/providers-list.component";

const components = [
  ObjectProfileComponent,
  HomeComponent,
  ModalInfoComponent,
  ReservationsListComponent,
  ComponentLoaderComponent,
  ProvidersListComponent
];

const services = [
  FetchService,
  ObjectProfileService
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
