import {Component} from '@angular/core';
import {ObjectProfile, ObjectProfileView} from "../../../../common/object-profile/services/object-profile.service";
import {Provider, Service} from "../../../rest-api-client";
import {AlertController, NavController} from "@ionic/angular";
import {AdminService} from "../../../../admin/services/admin.service";
import {Operation} from "../../../enum";

@ObjectProfile({
  view: ObjectProfileView.Consult,
  type: Provider
})
@Component({
  selector: 'app-provider-consult',
  templateUrl: './provider-consult.component.html',
  styleUrls: ['./provider-consult.component.scss'],
})
export class ProviderConsultComponent {
  object!: Provider;

  constructor(private navCtrl: NavController,
              private adminService: AdminService,
              private alertController: AlertController) { }

  serviceSelected(service: Service, operation: Operation) {
    if (operation === Operation.Edit) {
      this.navCtrl.navigateRoot('Create', {
        queryParams: {
          object: service,
          view: ObjectProfileView.Edit
        }
      });
    } else if (operation === Operation.Remove) {
      this.adminService.removeService(service.serviceId).subscribe(async removed => {
        if (removed) {
          this.object.services.splice(this.object.services.findIndex(s => s.serviceId === service.serviceId), 1);

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
