import { NgModule } from '@angular/core';
import { FetchService } from './services/fetch-service/fetch.service';
import { SharedModule } from '../shared/shared.module';
import { ObjectProfileComponent } from './object-profile/object-profile.component';
import { HomeComponent } from './components/home/home.component';
import { ModalInfoComponent } from './components/modal-info/modal-info.component';
import { ReservationsListComponent } from './components/reservations-list/reservations-list.component';

const components = [
  ObjectProfileComponent,
  HomeComponent,
  ModalInfoComponent,
  ReservationsListComponent
];

const services = [
  FetchService
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
