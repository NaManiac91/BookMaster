import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule as Common} from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { FetchService } from './services/fetch-service/fetch.service';
import { SharedModule } from '../shared/shared.module';
import { ObjectProfileComponent } from './object-profile/object-profile.component';
import { HomeComponent } from './components/home/home.component';
import { ModalInfoComponent } from './components/modal-info/modal-info.component';

const components = [
  UserDetailComponent,
  ObjectProfileComponent,
  HomeComponent,
  ModalInfoComponent
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
