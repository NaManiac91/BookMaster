import {Component, inject, OnInit, Type, ViewChild} from '@angular/core';
import {AdminService} from '../../services/admin.service';
import {IModel, Service, User} from 'src/app/modules/shared/rest-api-client';
import {SecurityService} from 'src/app/modules/shared/services/security.service';
import {ActivatedRoute} from '@angular/router';
import {ObjectProfileView} from "../../../common/object-profile/services/object-profile.service";
import {ObjectProfileComponent} from "../../../common/object-profile/components/object-profile.component";

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent  implements OnInit {
  user!: User;
  private activatedRoute = inject(ActivatedRoute);
  type!: string;
  view: ObjectProfileView = ObjectProfileView.Create;
  private object!: IModel;

  @ViewChild(ObjectProfileComponent) profileComponent!: ObjectProfileComponent;

  constructor(private adminService: AdminService,
              private securityService: SecurityService
  ) { }

  ngOnInit() {
    this.user = this.securityService.loggedUser;
    this.type = this.activatedRoute.snapshot.queryParams['type'];
  }

  onChangeInstance(object: IModel) {
    this.object = object;
  }

  create() {
    this.adminService.createService(<Service>this.object).subscribe(() => {
      console.log('Service created');
    });
  }
}
