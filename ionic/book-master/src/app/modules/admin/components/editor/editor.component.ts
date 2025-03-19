import {Component, inject, OnInit, Type} from '@angular/core';
import {AdminService} from '../../services/admin.service';
import {IModel, User} from 'src/app/modules/shared/rest-api-client';
import {AuthService} from 'src/app/modules/shared/services/auth/auth.service';
import {ActivatedRoute} from '@angular/router';
import {ObjectProfileView} from "../../../common/object-profile/services/object-profile.service";
import {ModelInitializerService} from "../../../shared/services/model-initializer/model-initializer.service";
import {NavController} from "@ionic/angular";

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit {
  user!: User;
  private activatedRoute = inject(ActivatedRoute);
  type!: Type<IModel>;
  view: ObjectProfileView = ObjectProfileView.Create;
  object!: IModel;

  constructor(private adminService: AdminService,
              private authService: AuthService,
              private modelInitializerService: ModelInitializerService,
              private navCtrl: NavController
  ) {
  }

  ngOnInit() {
    this.user = this.authService.loggedUser;
    this.object = this.activatedRoute.snapshot.queryParams['object'];
    const view = this.activatedRoute.snapshot.queryParams['view'];

    if (view) {
      this.view = view;
    }

    if (this.object) {
      this.type = this.modelInitializerService.getTypeByClassName(this.object.$t);
    } else {
      this.type = this.modelInitializerService.getTypeByClassName(this.activatedRoute.snapshot.queryParams['type']);
    }
  }

  save() {
    if (this.view === ObjectProfileView.Create) {
      this.adminService.create(this.object, this.user).subscribe(model =>
        this.navCtrl.navigateRoot('Home', {
          queryParams: {object: model}
        }));
    } else {
        this.adminService.edit(this.object, this.type).subscribe(model =>
          this.navCtrl.navigateRoot('Home', {
            queryParams: {object: model}
          }));
    }
  }
}
