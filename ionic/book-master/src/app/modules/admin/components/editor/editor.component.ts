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
  readonly: boolean = false;

  constructor(private adminService: AdminService,
              private modelInitializerService: ModelInitializerService,
              private navCtrl: NavController
  ) {
  }

  ngOnInit() {
    this.object = this.activatedRoute.snapshot.queryParams['object'];
    const view = this.activatedRoute.snapshot.queryParams['view'];
    const typeToken = this.object?.$t || this.activatedRoute.snapshot.queryParams['type'];

    if (!Number.isNaN(view)) {
      this.view = view;

      if (view === ObjectProfileView.CONSULT) {
        this.readonly = true;
      }
    }

    this.type = this.modelInitializerService.getTypeByToken(typeToken);

    if (!this.type) {
      throw new Error(`Unknown model type token: ${typeToken}`);
    }
  }

  get titleKey(): string {
    const action = this.resolveActionName();
    const typeLabel = this.objectTypeLabel.toLowerCase();
    return `editor.title.${action}.${typeLabel || 'imodel'}`;
  }

  private get objectTypeLabel(): string {
    return this.object?.$t || (this.type as any)?.$t || (this.type as any)?.name || '';
  }

  private resolveActionName(): string {
    switch (this.view) {
      case ObjectProfileView.CREATE:
        return 'create';
      case ObjectProfileView.EDIT:
        return 'edit';
      default:
        return 'consult';
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
