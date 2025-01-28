import { Component, OnInit } from '@angular/core';
import {ObjectProfile, ObjectProfileView} from "../../../../common/object-profile/services/object-profile.service";
import {Provider} from "../../../rest-api-client";

@ObjectProfile({
  view: ObjectProfileView.Create,
  type: Provider
})
@Component({
  selector: 'app-provider-create',
  templateUrl: './provider-create.component.html',
  styleUrls: ['./provider-create.component.scss'],
})
export class ProviderCreateComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
