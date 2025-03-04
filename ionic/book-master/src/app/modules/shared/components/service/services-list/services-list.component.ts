import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Service, Provider} from "../../../rest-api-client";
import {Router} from "@angular/router";
import {NavController} from "@ionic/angular";
import {ClientService} from "../../../../common/services/client-service/client.service";

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

  private previousNavigation!: string;

  constructor(private router: Router,
              private navCtrl: NavController,
              private clientService: ClientService) { }

  ngOnInit() {
    const curretNavigation = this.router.getCurrentNavigation();

    if (curretNavigation && curretNavigation.extras && curretNavigation.extras.state) {
      this.provider =  curretNavigation.extras.state['provider'];
      this.selectable =  curretNavigation.extras.state['selectable'];
      this.previousNavigation =  curretNavigation.extras.state['previousNavigation'];
    }

    if (this.provider) {
      this.services = this.provider.services;
    }
  }

  return(service?: Service) {
    this.navCtrl.navigateBack(this.previousNavigation, {
      state: {
        service: service
      }
    });
  }

  selectService(service: Service) {
    /*this.selected.emit(service);

    if (this.previousNavigation) {
      this.return(service);
    }*/

    this.clientService.getAvailableTimeSlots(this.provider.providerId).subscribe(slots => console.log(slots));
  }
}
