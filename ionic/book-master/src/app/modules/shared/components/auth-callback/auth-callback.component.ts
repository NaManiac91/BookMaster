import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth/auth.service";
import { Browser } from "@capacitor/browser";
import { User } from '../../rest-api-client';
import { TranslationService } from '../../modules/translation/services/translation.service';

@Component({
  selector: 'app-auth-callback',
  templateUrl: './auth-callback.component.html',
  styleUrls: ['./auth-callback.component.scss'],
})
export class AuthCallbackComponent implements OnInit {
  constructor(private authService: AuthService,
    private router: Router,
    private translationService: TranslationService) { }

  async ngOnInit() {
    // Close the browser window
    await Browser.close();

    // Check auth status
    this.authService.getAuthStatus().subscribe({
      next: (status) => {
        if (status.authenticated) {
          if (status.user) {
            const user = status.user as User;
            this.authService.loggedUser = user;
            this.translationService.applyUserLanguage(user).subscribe();
          }
          this.router.navigate(['/Home']);
        } else {
          this.router.navigate(['/login']);
        }
      },
      error: () => {
        this.router.navigate(['/login']);
      }
    });
  }
}
