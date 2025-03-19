import {Component} from '@angular/core';
import {Service} from "../../../rest-api-client";
import {
  ObjectProfile,
  ObjectProfileView
} from "../../../../common/object-profile/services/object-profile.service";

@ObjectProfile({
  view: [ObjectProfileView.Create, ObjectProfileView.Edit],
  type: Service
})
@Component({
  selector: 'app-service-create',
  templateUrl: './service-create.component.html',
  styleUrls: ['./service-create.component.scss'],
})
export class ServiceCreateComponent {
  object: Service;

  constructor() {}
}
