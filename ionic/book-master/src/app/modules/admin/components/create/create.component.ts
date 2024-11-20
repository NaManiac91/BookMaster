import { Component, OnInit, Type } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { IModel, Provider, Service, User } from 'src/app/modules/shared/rest-api-client';
import { FetchService } from 'src/app/modules/common/services/fetch-service/fetch.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent  implements OnInit {
  entityToCreate!: Type<IModel>;
  //user = User;
  //service = Service;
  //provider = Provider;
  users: User[] = [];
  user!: User;

  object: any = null;
  constructor(private adminService: AdminService,
              private fetchService: FetchService
  ) { }

  ngOnInit() {
    this.fetchService.getUsers().subscribe(users => {
      this.users = users;
      this.user = users[0];
    })
  }

  create() {

  }
}
