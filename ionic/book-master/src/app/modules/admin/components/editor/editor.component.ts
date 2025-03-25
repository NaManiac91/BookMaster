import {Component, inject, OnInit, Type} from '@angular/core';
import {AdminService} from '../../services/admin.service';
import {IModel} from 'src/app/modules/shared/rest-api-client';
import {ActivatedRoute} from '@angular/router';
import {ModelInitializerService} from "../../../shared/services/model-initializer/model-initializer.service";
import {NavController} from "@ionic/angular";
import {ObjectProfileView} from "../../../shared/enum";

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  type!: Type<IModel>;
  view: ObjectProfileView = ObjectProfileView.CREATE;
  object!: IModel;

  constructor(private adminService: AdminService,
              private modelInitializerService: ModelInitializerService,
              private navCtrl: NavController
  ) {
  }

  ngOnInit() {
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
    if (this.view === ObjectProfileView.CREATE) {
      this.adminService.create(this.object).subscribe(model =>
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
