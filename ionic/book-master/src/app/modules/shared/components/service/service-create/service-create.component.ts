import {Component} from '@angular/core';
import {Service} from "../../../rest-api-client";
import {
  ObjectProfile,
} from "../../../../common/object-profile/services/object-profile.service";
import {ObjectProfileView} from "../../../enum";

@ObjectProfile({
  view: [ObjectProfileView.CREATE, ObjectProfileView.EDIT],
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
