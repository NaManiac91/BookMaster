import {Component, inject, OnInit} from '@angular/core';
import {IModel, Provider, Service, User} from 'src/app/modules/shared/rest-api-client';
import {AuthService} from 'src/app/modules/shared/services/auth/auth.service';
import {NavController} from "@ionic/angular";
import {ActivatedRoute} from "@angular/router";
import {ObjectProfileView} from "../../../shared/enum";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  user!: User;
  provider!: Provider;
  view: ObjectProfileView = ObjectProfileView.CONSULT;
  private activatedRoute = inject(ActivatedRoute);

  constructor(private authService: AuthService,
              private navCtrl: NavController) {
  }

  ngOnInit() {
    const object: IModel = this.activatedRoute.snapshot.queryParams['object'];

    this.initUser(this.authService.loggedUser, object);
  }

  private initUser(user: User, object: IModel) {
    this.user = Object.assign(new User(), user);

    if (this.user.provider) {
      const provider = object && object instanceof Provider ? object : this.user.provider;
      this.provider = this.user.provider = Object.assign(new Provider(), provider);
    }
  }

  createService() {
    this.navCtrl.navigateRoot('Editor', {
      queryParams: {
        type: Service.name
      }
    });
  }
}
