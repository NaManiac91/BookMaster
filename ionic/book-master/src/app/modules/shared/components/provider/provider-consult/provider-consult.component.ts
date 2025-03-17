import {Component} from '@angular/core';
import {ObjectProfile, ObjectProfileView} from "../../../../common/object-profile/services/object-profile.service";
import {Provider, Service} from "../../../rest-api-client";
import {NavController} from "@ionic/angular";

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

  constructor(private navCtrl: NavController) { }

  serviceSelected(service: Service, operation: string) {
    if (operation == 'edit') {
      this.navCtrl.navigateRoot('Create', {
        queryParams: {
          object: service,
          view: ObjectProfileView.Edit
        }
      });
    } else if (operation == 'delete') {
      // TO DO DELETE
    }
  }
}
