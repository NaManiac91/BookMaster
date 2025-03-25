import {Component, ViewChild} from '@angular/core';
import {ObjectProfile} from "../../../services/object-profile.service";
import {Provider, Service} from "../../../../../rest-api-client";
import {AlertController, NavController} from "@ionic/angular";
import {AdminService} from "../../../../../../admin/services/admin.service";
import {ObjectProfileView, Operation} from "../../../../../enum";
import {ServicesListComponent} from "../../service/services-list/services-list.component";

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
              private alertController: AlertController) { }

  serviceSelected(service: Service, operation: Operation) {
    if (operation === Operation.EDIT) {
      this.navCtrl.navigateRoot('Editor', {
        queryParams: {
          object: service,
          view: ObjectProfileView.EDIT
        }
      });
    } else if (operation === Operation.REMOVE) {
      this.adminService.removeService(service.serviceId).subscribe(async removed => {
        if (removed) {
          this.object.services.splice(this.object.services.findIndex(s => s.serviceId === service.serviceId), 1);
          this.serviceListComponent.services = this.object.services;

          const alert = await this.alertController.create({
            message: 'Service removed successfully.',
            buttons: ['OK'],
          });

          await alert.present();
        }
      })
    }
  }
}
