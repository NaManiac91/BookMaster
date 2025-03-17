import {Component, inject, OnInit, Type} from '@angular/core';
import {AdminService} from '../../services/admin.service';
import {IModel, User} from 'src/app/modules/shared/rest-api-client';
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
    this.object = this.activatedRoute.snapshot.queryParams['object'];

    if (this.object) {
      this.type = this.modelInitializerService.getTypeByClassName(this.object.$t);
    } else {
      this.type = this.modelInitializerService.getTypeByClassName(this.activatedRoute.snapshot.queryParams['type']);
    }
  }

  create() {
    this.adminService.create(this.object, this.user).subscribe(() => {
      this.navCtrl.navigateRoot('');
    });
  }
}
