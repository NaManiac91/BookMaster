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
  isProvider: boolean = false;
  languageOptions = [
    { value: 'en', labelKey: 'language.english' },
    { value: 'it', labelKey: 'language.italian' },
    { value: 'fr', labelKey: 'language.french' }
  ];

  constructor() { }

  ngOnInit() {
    if (!this.object) {
      this.object = new User();
    }

    if (!this.object.language) {
      this.object.language = 'en';
    }
    this.isProvider = !!this.object?.provider;
    this.syncProviderState();
  }

  onProviderChange() {
    this.syncProviderState();
  }

  private syncProviderState() {
    if (this.isProvider) {
      if (!this.object.provider) {
        this.object.provider = new Provider();
      }
      if (!this.object.provider.address) {
        this.object.provider.address = new Address();
      }
      return;
    }

    this.object.provider = undefined as unknown as Provider;
  }
}
