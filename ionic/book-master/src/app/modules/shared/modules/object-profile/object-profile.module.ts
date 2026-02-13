import {NgModule} from "@angular/core";
import {ObjectProfileComponent} from "./components/object-profile.component";
import {ComponentLoaderComponent} from "./components/component-loader.component";
import {ObjectProfileService} from "./services/object-profile.service";
import {CommonModule} from "@angular/common";
import {ServiceCreateComponent} from "./profiles/service/service-create/service-create.component";
import {ProviderCreateComponent} from "./profiles/provider/provider-create/provider-create.component";
import {ProviderConsultComponent} from "./profiles/provider/provider-consult/provider-consult.component";
import {ProviderReservationInfoComponent} from "./profiles/provider/provider-reservation-info/provider-reservation-info.component";
import {UserDetailComponent} from "./profiles/user/user-detail/user-detail.component";
import {ReservationsListComponent} from "./profiles/reservation/reservations-list/reservations-list.component";
import {ProvidersListComponent} from "./profiles/provider/providers-list/providers-list.component";
import {ServicesListComponent} from "./profiles/service/services-list/services-list.component";
import {UserCreateComponent} from "./profiles/user/user-create/user-create.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";

const components = [
  ObjectProfileComponent,
  ComponentLoaderComponent,
  ServiceCreateComponent,
  ProviderCreateComponent,
  ProviderConsultComponent,
  ProviderReservationInfoComponent,
  UserDetailComponent,
  ReservationsListComponent,
  ProvidersListComponent,
  ServicesListComponent,
  UserCreateComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule
  ],
  declarations: components,
  exports: components,
  providers: [ObjectProfileService]
})
export class ObjectProfileModule {

}
