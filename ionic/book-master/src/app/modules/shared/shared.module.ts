import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { SecurityService } from "./services/security.service";
import { LoginComponent } from "../folder/login/login.component";

const components = [
    LoginComponent
];

const services = [
    SecurityService
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        HttpClientModule
    ],
    declarations: [LoginComponent],
    exports: [
        CommonModule,
        FormsModule,
        IonicModule,
        HttpClientModule,
        LoginComponent
    ],
    providers: services
  })
export class SharedModule {

}