import {Component, OnInit} from '@angular/core';
import {Service} from "../../../rest-api-client";
import {
  IProfileComponent,
  ObjectProfile,
  ObjectProfileView
} from "../../../../common/object-profile/services/object-profile.service";

@ObjectProfile({
  view: ObjectProfileView.Create,
  type: Service
})
@Component({
  selector: 'app-service-create',
  templateUrl: './service-create.component.html',
  styleUrls: ['./service-create.component.scss'],
})
export class ServiceCreateComponent implements OnInit, IProfileComponent {
  object!: Service;

  constructor() {}

  ngOnInit() {

  }

}
