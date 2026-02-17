import {
  Component,
  EventEmitter,
  Input,
  Output,
  Type,
} from '@angular/core';
import {IModel} from '../../../rest-api-client';
import { ObjectProfileService} from "../services/object-profile.service";
import {ObjectProfileView} from "../../../enum";

@Component({
  selector: 'app-object-profile',
  templateUrl: './object-profile.component.html',
  styleUrls: ['./object-profile.component.scss'],
})
export class ObjectProfileComponent {
  profileComponent!: any;
  private _view: ObjectProfileView = ObjectProfileView.CONSULT;
  @Input() set view(value: ObjectProfileView) {
    this._view = value;
    this.updateProfile();
  }

  get view(): ObjectProfileView {
    return this._view;
  }

  private _type!: string;
  private _object!: any;
  @Input() set object(value: Type<IModel> | IModel) {
    if (typeof value === 'object') {
      this._object = value;
    } else {
      this._object = new(value as Type<IModel>);
    }
    this._type = typeof this._object === 'object' ? this._object.$t : this._object;


    this.updateProfile();
  }

  get object(): any {
    return this._object;
  }

  @Output() instance = new EventEmitter();

  constructor(private objectProfileService: ObjectProfileService){}

  updateProfile() {
    if (!this._type) {
      return;
    }
    this.profileComponent = this.objectProfileService.getObjectProfile(this._type, this.view);
  }
}
