import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { SecurityService } from "./services/security/security.service";
import { ServiceCreateComponent } from "./components/service/service-create/service-create.component";
import { ProviderCreateComponent } from "./components/provider/provider-create/provider-create.component";
import { LoginComponent } from "./components/login/login.component";
import { UserDetailComponent } from "./components/user/user-detail/user-detail.component";
import {ModelInitializerService} from "./services/model-initializer/model-initializer.service";

const components = [
    LoginComponent,
    ServiceCreateComponent,
    ProviderCreateComponent,
    UserDetailComponent
];

const services = [
    SecurityService,
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
    providers: services
  })
export class SharedModule {

}
