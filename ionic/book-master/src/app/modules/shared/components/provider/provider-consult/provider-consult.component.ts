import { Component } from '@angular/core';
import {ObjectProfile, ObjectProfileView} from "../../../../common/object-profile/services/object-profile.service";
import {Provider} from "../../../rest-api-client";

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
  closed = false;
  constructor() { }

  open() {
    this.closed = !this.closed;
  }
}
