import {NgModule} from '@angular/core';
import {FetchService} from './services/fetch-service/fetch.service';
import {SharedModule} from '../shared/shared.module';
import {ObjectProfileComponent} from './object-profile/components/object-profile.component';
import {HomeComponent} from './components/home/home.component';
import {ModalInfoComponent} from './components/modal/modal-info/modal-info.component';
import {ObjectProfileService} from "./object-profile/services/object-profile.service";
import {ClientService} from "./services/client-service/client.service";
import {ReservationWorkflowComponent} from "./components/reservation-workflow/reservation-workflow.component";

const components = [
  ObjectProfileComponent,
  HomeComponent,
  ModalInfoComponent,
  ReservationWorkflowComponent
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
export class CommonModule {
}
