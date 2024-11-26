import { Component, Input, OnInit } from '@angular/core';
import { Reservation, Service } from 'src/app/modules/shared/rest-api-client';
import { ModalInfoComponent } from '../modal-info/modal-info.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-reservations-list',
  templateUrl: './reservations-list.component.html',
  styleUrls: ['./reservations-list.component.scss'],
})
export class ReservationsListComponent  implements OnInit {
  @Input() list: Reservation[] = [];

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}

  
  async showServiceInfo(service: Service) {
    const modal = await this.modalCtrl.create({
      component: ModalInfoComponent,
      componentProps: {data : {title: 'Service Info', info: service.name}}
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      
    }
  }
}
