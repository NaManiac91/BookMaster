import {Component, Input} from '@angular/core';
import {
  ObjectProfile,
} from "../../../services/object-profile.service";
import {Address, Provider} from "../../../../../rest-api-client";
import {ObjectProfileView, ProviderType} from "../../../../../enum";

@ObjectProfile({
  view: [ObjectProfileView.CREATE, ObjectProfileView.EDIT],
  type: Provider
})
@Component({
  selector: 'app-provider-create',
  templateUrl: './provider-create.component.html',
  styleUrls: ['./provider-create.component.scss'],
})
export class ProviderCreateComponent {
  private _object!: Provider;
  @Input() set object(value: Provider) {
    this._object = value;
    if (this._object && !this._object.address) {
      this._object.address = new Address();
    }
  }

  get object(): Provider {
    return this._object;
  }

  types = Object.values(ProviderType).filter(v => !Number.isFinite(v));

  constructor() { }
}
