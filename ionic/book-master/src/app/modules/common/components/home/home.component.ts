import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Service, User} from 'src/app/modules/shared/rest-api-client';
import { SecurityService } from 'src/app/modules/shared/services/security/security.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent  implements OnInit {
  user!: User;

  constructor(private securityService: SecurityService,
              private router: Router
  ) { }

  ngOnInit() {
    this.user = this.securityService.loggedUser;
  }

  createService() {
    this.router.navigate(['Create'], {queryParams: {
      type: Service.name
    }});
  }
}
