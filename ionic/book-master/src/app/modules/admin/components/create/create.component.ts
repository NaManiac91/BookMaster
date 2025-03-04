import {Component, inject, OnInit, Type} from '@angular/core';
import {AdminService} from '../../services/admin.service';
import {IModel, Service, User} from 'src/app/modules/shared/rest-api-client';
import {SecurityService} from 'src/app/modules/shared/services/security/security.service';
import {ActivatedRoute} from '@angular/router';
import {ObjectProfileView} from "../../../common/object-profile/services/object-profile.service";
import {ModelInitializerService} from "../../../shared/services/model-initializer/model-initializer.service";
import {NavController} from "@ionic/angular";

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
  user!: User;
  private activatedRoute = inject(ActivatedRoute);
  type!: Type<IModel>;
  view: ObjectProfileView = ObjectProfileView.Create;
  object!: IModel;

  constructor(private adminService: AdminService,
              private securityService: SecurityService,
              private modelInitializerService: ModelInitializerService,
              private navCtrl: NavController
  ) {
  }

  ngOnInit() {
    this.user = this.securityService.loggedUser;
    this.type = this.modelInitializerService.getTypeByClassName(this.activatedRoute.snapshot.queryParams['type']);
  }

  create() {
    this.adminService.createService(<Service>this.object, this.user.provider.providerId).subscribe(provider => {
      this.securityService.setProvider(provider);
      this.navCtrl.navigateRoot('');
    });
  }
}
