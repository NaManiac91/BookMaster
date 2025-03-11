import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FetchService} from "../../../../common/services/fetch-service/fetch.service";
import {Provider} from "../../../rest-api-client";
import {ObjectProfile, ObjectProfileView} from "../../../../common/object-profile/services/object-profile.service";

@ObjectProfile({
  view: ObjectProfileView.List,
  type: Provider
})
@Component({
  selector: 'app-providers-list',
  templateUrl: './providers-list.component.html',
  styleUrls: ['./providers-list.component.scss'],
})
export class ProvidersListComponent implements OnInit {
  @Output() selected: EventEmitter<Provider> = new EventEmitter();

  providers: Provider[] = [];

  constructor(private fetchService: FetchService) { }

  ngOnInit() {
    this.fetchService.getProviders().subscribe(providers => this.providers = providers);
  }
}
