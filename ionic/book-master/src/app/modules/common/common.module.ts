import {NgModule} from '@angular/core';
import {FetchService} from './services/fetch-service/fetch.service';
import {SharedModule} from '../shared/shared.module';
import {HomeComponent} from './components/home/home.component';
import {ModalInfoComponent} from './components/modal/modal-info/modal-info.component';
import {ClientService} from "./services/client-service/client.service";
import {ReservationWorkflowComponent} from "./components/reservation-workflow/reservation-workflow.component";

const components = [
  HomeComponent,
  ModalInfoComponent,
  ReservationWorkflowComponent
];

const services = [
  FetchService,
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
export class CommonModule {
}
