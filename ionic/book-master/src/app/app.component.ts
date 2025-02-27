import {Component, OnInit} from '@angular/core';
import { SecurityService } from './modules/shared/services/security/security.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  appPages = [
    { title: 'Home', url: '/Home', icon: 'home' },
    { title: 'Providers', url: '/Providers', icon: 'storefront' }
  ];

  isLogged: boolean = false;

  constructor(private securityService: SecurityService) { }

  ngOnInit() {
    if (this.securityService.loggedUser) {
      this.isLogged = true;
    }
  }
}
