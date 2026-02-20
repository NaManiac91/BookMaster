import {Component, inject, OnDestroy, OnInit, Type} from '@angular/core';
import {AdminService} from '../../services/admin.service';
import {IModel} from 'src/app/modules/shared/rest-api-client';
import {ActivatedRoute, Router} from '@angular/router';
import {ModelInitializerService} from "../../../shared/services/model-initializer/model-initializer.service";
import {NavController} from "@ionic/angular";
import {ObjectProfileView} from "../../../shared/enum";
import {readNavigationState} from "../../../shared/utils/navigation-state.utils";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit, OnDestroy {
  private activatedRoute = inject(ActivatedRoute);
  private queryParamsSub?: Subscription;
  type!: Type<IModel>;
  view: ObjectProfileView = ObjectProfileView.CREATE;
  object!: IModel;
  readonly: boolean = false;

  constructor(private adminService: AdminService,
              private modelInitializerService: ModelInitializerService,
              private router: Router,
              private navCtrl: NavController
  ) {
  }

  ngOnInit() {
    this.initializeEditorState();
    this.queryParamsSub = this.activatedRoute.queryParams.subscribe(() => this.initializeEditorState());
  }

  ngOnDestroy() {
    this.queryParamsSub?.unsubscribe();
  }

  private initializeEditorState() {
    const navigationState = readNavigationState<{object?: IModel; view?: ObjectProfileView; type?: string}>(this.router);
    this.object = (navigationState.object as IModel) || this.activatedRoute.snapshot.queryParams['object'];
    const view = navigationState.view ?? this.activatedRoute.snapshot.queryParams['view'];
    const typeToken = this.object?.$t || navigationState.type || this.activatedRoute.snapshot.queryParams['type'];

    if (view !== undefined && view !== null && !Number.isNaN(Number(view))) {
      this.view = Number(view);
    } else {
      this.view = ObjectProfileView.CREATE;
    }
    this.readonly = this.view === ObjectProfileView.CONSULT;

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
          state: {object: model}
        }));
    } else {
        this.adminService.edit(this.object, this.type).subscribe(model =>
          this.navCtrl.navigateRoot('Home', {
            state: {object: model}
          }));
    }
  }
}
