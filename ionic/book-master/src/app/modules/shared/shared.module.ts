import {CommonModule} from "@angular/common";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {ErrorHandler, NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {AuthService} from "./services/auth/auth.service";
import {ServiceCreateComponent} from "./components/service/service-create/service-create.component";
import {ProviderCreateComponent} from "./components/provider/provider-create/provider-create.component";
import {LoginComponent} from "./components/login/login.component";
import {UserDetailComponent} from "./components/user/user-detail/user-detail.component";
import {ModelInitializerService} from "./services/model-initializer/model-initializer.service";
import {ProviderConsultComponent} from "./components/provider/provider-consult/provider-consult.component";
import {ReservationsListComponent} from "./components/reservation/reservations-list/reservations-list.component";
import {ComponentLoaderComponent} from "../common/object-profile/components/component-loader.component";
import {ProvidersListComponent} from "./components/provider/providers-list/providers-list.component";
import {ServicesListComponent} from "./components/service/services-list/services-list.component";
import {GlobalErrorHandler} from "./HTTPHandlers/GlobalErrorHandler";
import {HttpLoadingInterceptor} from "./HTTPHandlers/HttpLoadingInterceptor";

const components = [
  LoginComponent,
  ServiceCreateComponent,
  ProviderCreateComponent,
  ProviderConsultComponent,
  UserDetailComponent,
  ReservationsListComponent,
  ComponentLoaderComponent,
  ProvidersListComponent,
  ServicesListComponent
];

const services = [
  AuthService,
  ModelInitializerService
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    HttpClientModule
  ],
  declarations: components,
  exports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HttpClientModule,
    components
  ],
  providers: [
    ...services, {
    // processes all errors
    provide: ErrorHandler,
    useClass: GlobalErrorHandler,
    },
    {
      // interceptor to show loading spinner
      provide: HTTP_INTERCEPTORS,
      useClass: HttpLoadingInterceptor,
      multi: true,
    }]
})
export class SharedModule {

}
