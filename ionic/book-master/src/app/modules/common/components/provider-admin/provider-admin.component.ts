import {Component, OnInit} from '@angular/core';
import {Provider, Service, User} from '../../../shared/rest-api-client';
import {AuthService} from '../../../shared/services/auth/auth.service';
import {NavController} from '@ionic/angular';
import {ObjectProfileView} from '../../../shared/enum';

@Component({
  selector: 'app-provider-admin',
  templateUrl: './provider-admin.component.html',
  styleUrls: ['./provider-admin.component.scss'],
})
export class ProviderAdminComponent implements OnInit {
  user!: User;
  provider!: Provider;
  view: ObjectProfileView = ObjectProfileView.CONSULT;

  constructor(private authService: AuthService,
              private navCtrl: NavController) {}

  ngOnInit() {
    this.user = Object.assign(new User(), this.authService.loggedUser);
    if (this.user?.provider) {
      this.provider = Object.assign(new Provider(), this.user.provider);
    }
  }

  editProvider() {
    if (!this.provider) {
      return;
    }

    this.navCtrl.navigateRoot('Editor', {
      queryParams: {
        object: this.provider,
        view: ObjectProfileView.EDIT
      }
    });
  }

  createService() {
    this.navCtrl.navigateRoot('Editor', {
      queryParams: {
        type: Service.$t
      }
    });
  }
}
