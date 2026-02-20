import {Component, ViewChild} from '@angular/core';
import {ObjectProfile} from "../../../services/object-profile.service";
import {Provider, Service} from "../../../../../rest-api-client";
import {AlertController, NavController} from "@ionic/angular";
import {AdminService} from "../../../../../../admin/services/admin.service";
import {ObjectProfileView, Operation} from "../../../../../enum";
import {ServicesListComponent} from "../../service/services-list/services-list.component";
import {AuthService} from "../../../../../services/auth/auth.service";
import {TranslationService} from "../../../../translation/services/translation.service";

@ObjectProfile({
  view: ObjectProfileView.CONSULT,
  type: Provider
})
@Component({
  selector: 'app-provider-consult',
  templateUrl: './provider-consult.component.html',
  styleUrls: ['./provider-consult.component.scss'],
})
export class ProviderConsultComponent {
  object!: Provider;
  @ViewChild('servicesListComponent') serviceListComponent!: ServicesListComponent;

  constructor(private navCtrl: NavController,
              private adminService: AdminService,
              private authService: AuthService,
              private alertController: AlertController,
              private translationService: TranslationService) { }

  serviceSelected(service: Service, operation: Operation) {
    if (operation === Operation.EDIT) {
      this.navCtrl.navigateRoot('Editor', {
        state: {
          object: service,
          view: ObjectProfileView.EDIT
        }
      });
    } else if (operation === Operation.REMOVE) {
      this.adminService.removeService(service.serviceId).subscribe(async removed => {
        if (removed) {
          this.object.services.splice(this.object.services.findIndex(s => s.serviceId === service.serviceId), 1);
          this.serviceListComponent.services = this.object.services;
          this.authService.updateLoggedUserProvider(this.object);

          const alert = await this.alertController.create({
            message: this.translationService.translate('service.removedSuccess'),
            buttons: [this.translationService.translate('common.ok')],
          });

          await alert.present();
        }
      })
    }
  }
}
