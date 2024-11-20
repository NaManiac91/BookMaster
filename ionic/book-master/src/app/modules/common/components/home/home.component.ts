import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Service, User } from 'src/app/modules/shared/rest-api-client';
import { SecurityService } from 'src/app/modules/shared/services/security.service';
import { ModalInfoComponent } from '../modal-info/modal-info.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent  implements OnInit {
  user!: User;

  constructor(private securityService: SecurityService,
              private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.user = this.securityService.loggedUser;
  }

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
