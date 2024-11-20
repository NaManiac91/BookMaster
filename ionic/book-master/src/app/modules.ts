import { BrowserModule } from "@angular/platform-browser";
import { IonicModule } from "@ionic/angular";
import { AppRoutingModule } from "./app-routing.module";
import { SharedModule } from "./modules/shared/shared.module";
import { AdminModule } from "./modules/admin/admin.module";

export const MODULES = [
  BrowserModule, 
  IonicModule.forRoot(), 
  AppRoutingModule, 
  SharedModule,
  AdminModule
]