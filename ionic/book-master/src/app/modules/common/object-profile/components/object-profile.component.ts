import {
  Component,
  EventEmitter,
  Input,
  Output,
  Type,
} from '@angular/core';
import {IModel} from '../../../shared/rest-api-client';
import { ObjectProfileService} from "../services/object-profile.service";
import {ObjectProfileView} from "../../../shared/enum";

@Component({
  selector: 'app-object-profile',
  templateUrl: './object-profile.component.html',
  styleUrls: ['./object-profile.component.scss'],
})
export class ObjectProfileComponent {
  profileComponent!: any;
  @Input() view: ObjectProfileView = ObjectProfileView.CONSULT;

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
    this.profileComponent = this.objectProfileService.getObjectProfile(this._type, this.view);
  }
}
