import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Provider, Service, User} from 'src/app/modules/shared/rest-api-client';
import { SecurityService } from 'src/app/modules/shared/services/security/security.service';
import {ObjectProfileView} from "../../object-profile/services/object-profile.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent  implements OnInit {
  user!: User;
  provider!: Provider;
  view: ObjectProfileView = ObjectProfileView.Consult;

  constructor(private securityService: SecurityService,
              private router: Router
  ) { }

  ngOnInit() {
    this.initUser(this.securityService.loggedUser);

    this.securityService.userChange$.subscribe(user => this.initUser(user))
  }

  private initUser(user: User) {
    this.user = Object.assign(new User(), user);

    if (this.user.provider) {
      this.user.provider = Object.assign(new Provider(), this.user.provider);
      this.provider = this.user.provider;
    }
  }

  createService() {
    this.router.navigate(['Create'], {queryParams: {
      type: Service.name
    }});
  }
}
