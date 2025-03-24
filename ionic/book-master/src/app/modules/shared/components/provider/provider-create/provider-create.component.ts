import {Component, Input} from '@angular/core';
import {
  ObjectProfile,
} from "../../../../common/object-profile/services/object-profile.service";
import {Provider} from "../../../rest-api-client";
import {ObjectProfileView, ProviderType} from "../../../enum";

@ObjectProfile({
  view: ObjectProfileView.CREATE,
  type: Provider
})
@Component({
  selector: 'app-provider-create',
  templateUrl: './provider-create.component.html',
  styleUrls: ['./provider-create.component.scss'],
})
export class ProviderCreateComponent {
  @Input() object: Provider
  types = Object.values(ProviderType).filter(v => !Number.isFinite(v));

  constructor() { }
}
