import {Component, OnInit} from '@angular/core';
import { AuthService } from './modules/shared/services/auth/auth.service';
import { TranslationService } from './modules/shared/modules/translation/services/translation.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  readonly homePage = { titleKey: 'menu.home', url: '/Home', icon: 'home' };
  readonly providersPage = { titleKey: 'menu.providers', url: '/ReservationWorkflow', icon: 'storefront' };

  isLogged: boolean = false;

  constructor(private authService: AuthService,
              private translationService: TranslationService) { }

  ngOnInit() {
    const loggedUser = this.authService.loggedUser;
    this.translationService.applyUserLanguage(loggedUser).subscribe();
    this.isLogged = !!loggedUser;
  }

  onLogged() {
    this.translationService.applyUserLanguage(this.authService.loggedUser).subscribe(() => {
      this.isLogged = true;
    });
  }

  get appPages() {
    if (this.authService.loggedUser?.provider) {
      return [this.homePage];
    }
    return [this.homePage, this.providersPage];
  }
}
