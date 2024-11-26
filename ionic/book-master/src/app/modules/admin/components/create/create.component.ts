import { Component, inject, OnInit, Type } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { IModel, User } from 'src/app/modules/shared/rest-api-client';
import { SecurityService } from 'src/app/modules/shared/services/security.service';
import { ActivatedRoute } from '@angular/router';
import { ProviderCreateComponent } from 'src/app/modules/shared/components/provider/provider-create/provider-create.component';
import { ServiceCreateComponent } from 'src/app/modules/shared/components/service/service-create/service-create.component';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent  implements OnInit {
  entityToCreate!: Type<IModel>;
  users: User[] = [];
  user!: User;
  private activatedRoute = inject(ActivatedRoute);
  private type!: string;

  object: any = null;
  constructor(private adminService: AdminService,
              private securityService: SecurityService
  ) { }

  ngOnInit() {
    this.user = this.securityService.loggedUser;
    this.type = this.activatedRoute.snapshot.paramMap.get('type') as string;
  }

  getCreateComponent(): Type<any> {
    return this.type == 'provider' ? ProviderCreateComponent : ServiceCreateComponent;
  }

  create() {

  }
}
