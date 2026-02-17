import { Component, OnInit } from '@angular/core';
import { FetchService } from 'src/app/modules/common/services/fetch-service/fetch.service';
import {ObjectProfile} from "../../../services/object-profile.service";
import {ObjectProfileView} from "../../../../../enum";
import {User} from "../../../../../rest-api-client";

@ObjectProfile({
  view: ObjectProfileView.CONSULT,
  type: User
})
@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent  implements OnInit {
  services: any[]= [];
  providers: any[]= [];

  constructor(private fetchService: FetchService) { }

  ngOnInit() {
    this.fetchService.getServices().subscribe(services => {
      this.services = services;
    })

    this.fetchService.getProviders().subscribe(providers => {
      this.providers = providers;
    })
  }

}
