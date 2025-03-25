import {Component, OnInit} from '@angular/core';
import {ObjectProfile} from "../../../services/object-profile.service";
import {Address, Provider, User} from "../../../../../rest-api-client";
import {ObjectProfileView} from "../../../../../enum";

@ObjectProfile({
  view: ObjectProfileView.CREATE,
  type: User
})
@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss'],
})
export class UserCreateComponent implements OnInit {
  object: User;
  view: ObjectProfileView = ObjectProfileView.CREATE;

  constructor() { }

  ngOnInit() {
    this.object.provider = new Provider();
    this.object.provider.address = new Address();
  }
}
