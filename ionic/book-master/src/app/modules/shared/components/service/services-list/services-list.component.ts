import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Service, Provider} from "../../../rest-api-client";
import {Router} from "@angular/router";
import {NavController} from "@ionic/angular";
import {ObjectProfile, ObjectProfileView} from "../../../../common/object-profile/services/object-profile.service";

@ObjectProfile({
  view: ObjectProfileView.List,
  type: Service
})
@Component({
  selector: 'app-services-list',
  templateUrl: './services-list.component.html',
  styleUrls: ['./services-list.component.scss'],
})
export class ServicesListComponent  implements OnInit {
  @Input() provider!: Provider;
  @Input() services: Service[] = [];
  @Input() selectable = false;

  @Output() selected = new EventEmitter<Service>();
  @Output() closed = new EventEmitter<void>();

  private previousNavigation!: string;

  constructor(private router: Router,
              private navCtrl: NavController) { }

  ngOnInit() {
    const currentNavigation = this.router.getCurrentNavigation();

    if (currentNavigation && currentNavigation.extras && currentNavigation.extras.state) {
      this.provider =  currentNavigation.extras.state['provider'];
      this.selectable =  currentNavigation.extras.state['selectable'];
      this.previousNavigation =  currentNavigation.extras.state['previousNavigation'];
    }

    if (this.provider) {
      this.services = this.provider.services;
    }
  }

  return(service?: Service) {
    if (this.previousNavigation) {
      this.navCtrl.navigateBack(this.previousNavigation, {
        state: {
          service: service
        }
      });
    } else {
      this.closed.emit();
    }
  }

  selectService(service: Service) {
    this.selected.emit(service);
  }
}
