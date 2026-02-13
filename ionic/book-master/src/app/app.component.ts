import {Component, OnInit} from '@angular/core';
import { AuthService } from './modules/shared/services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  appPages = [
    { title: 'Home', url: '/Home', icon: 'home' },
    { title: 'Providers', url: '/ReservationWorkflow', icon: 'storefront' },
    { title: 'History', url: '/ReservationHistory', icon: 'time' }
  ];

  isLogged: boolean = false;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    if (this.authService.loggedUser) {
      this.isLogged = true;
    }
  }
}
