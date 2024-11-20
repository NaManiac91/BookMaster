import { Component, Input, OnInit, Type } from '@angular/core';
import { IModel } from '../../shared/rest-api-client';

export enum ObjectProfileView {
  Consult, 
  Create,
  Edit
} 

@Component({
  selector: 'app-object-profile',
  templateUrl: './object-profile.component.html',
  styleUrls: ['./object-profile.component.scss'],
})
export class ObjectProfileComponent  implements OnInit {
  @Input() object!: IModel;
  @Input() view: ObjectProfileView = ObjectProfileView.Consult;

  private _type!: Type<IModel>;
  @Input() set type(value: Type<IModel>) {
    if (!this.object && value) {
      this.object = new (value);
    }
    this._type = value;
  }

  get type(): Type<IModel> {
    return this._type; 
  }

  constructor() { }

  ngOnInit() {}

}
