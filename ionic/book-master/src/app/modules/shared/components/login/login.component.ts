import {Component, OnInit, Output} from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {User} from '../../rest-api-client';
import {Subject} from 'rxjs';
import {NavController} from "@ionic/angular";
import {ObjectProfileView} from "../../enum";
import {TranslationService} from "../../modules/translation/services/translation.service";
import {isValidUser} from "../../utils/model-validation.utils";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  username!: string;
  password!: string;
  signupPassword!: string;
  forcePasswordChange = false;
  newPassword = '';
  confirmNewPassword = '';
  private pendingCurrentPassword = '';
  showUserCreate: boolean = false;
  user: User;
  view: ObjectProfileView = ObjectProfileView.CREATE;

  @Output() logged: Subject<void> = new Subject<void>();

  constructor(private authService: AuthService,
              private navCtrl: NavController,
              private translationService: TranslationService) {
  }

  ngOnInit() {
    if (this.authService.loggedUser) {
      this.navCtrl.navigateRoot('');
    }
  }

  login() {
    this.authService.login(this.username, this.password).subscribe(payload => {
      const loggedUser = payload.user as User;
      if (payload.requiresPasswordChange) {
        this.pendingCurrentPassword = this.password;
        this.forcePasswordChange = true;
        return;
      }

      this.completeLogin(loggedUser);
    });
  }

  changePassword() {
    if (!this.canSubmitPasswordChange) {
      return;
    }

    this.authService.changePassword(this.pendingCurrentPassword, this.newPassword).subscribe(payload => {
      const loggedUser = payload.user as User;
      this.forcePasswordChange = false;
      this.pendingCurrentPassword = '';
      this.newPassword = '';
      this.confirmNewPassword = '';
      this.completeLogin(loggedUser);
    });
  }

  signup() {
    this.showUserCreate = true;
    this.user = new User();
    this.user.language = 'en';
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle();
  }

  get canCreateUser(): boolean {
    return isValidUser(this.user) && !!this.signupPassword && this.signupPassword.length >= 8;
  }

  createUser() {
    if (!this.canCreateUser) {
      return;
    }

    if (!this.user.provider?.name) {
      this.user.provider = undefined as any;
    }

    this.authService.register({
      username: this.user.username,
      email: this.user.email,
      password: this.signupPassword,
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      language: this.user.language,
      provider: this.user.provider
    }).subscribe(payload => {
      const loggedUser = payload.user as User;
      this.completeLogin(loggedUser);
    });
  }

  get canSubmitPasswordChange(): boolean {
    return !!this.newPassword
      && this.newPassword.length >= 8
      && this.newPassword === this.confirmNewPassword
      && this.newPassword !== this.pendingCurrentPassword;
  }

  private completeLogin(loggedUser: User) {
    this.authService.loggedUser = loggedUser;
    this.translationService.applyUserLanguage(loggedUser).subscribe(() => this.logged.next());
  }
}
