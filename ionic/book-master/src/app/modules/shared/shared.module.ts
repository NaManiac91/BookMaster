import {CommonModule} from "@angular/common";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {ErrorHandler, NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {AuthService} from "./services/auth/auth.service";
import {LoginComponent} from "./components/login/login.component";
import {ModelInitializerService} from "./services/model-initializer/model-initializer.service";
import {GlobalErrorHandler} from "./HTTPHandlers/GlobalErrorHandler";
import {HttpLoadingInterceptor} from "./HTTPHandlers/HttpLoadingInterceptor";
import {ObjectProfileModule} from "./modules/object-profile/object-profile.module";
import {AuthCallbackComponent} from "./components/auth-callback/auth-callback.component";
import {TranslationModule} from "./modules/translation/translation.module";

const components = [
  LoginComponent,
  AuthCallbackComponent
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
    HttpClientModule,
    ObjectProfileModule,
    TranslationModule
  ],
  declarations: components,
  exports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HttpClientModule,
    components,
    ObjectProfileModule,
    TranslationModule
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
