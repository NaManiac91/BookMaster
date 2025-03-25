import {HttpClient} from '@angular/common/http';
import {Component, OnInit, Output} from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {User} from '../../rest-api-client';
import {Subject} from 'rxjs';
import {NavController} from "@ionic/angular";
import {ObjectProfileView} from "../../enum";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  username!: string;
  password!: string;
  showUserCreate: boolean = false;
  user: User;
  view: ObjectProfileView = ObjectProfileView.CREATE;

  @Output() logged: Subject<void> = new Subject<void>();

  constructor(private httpClient: HttpClient,
              private authService: AuthService,
              private navCtrl: NavController) {
  }

  ngOnInit() {
    if (this.authService.loggedUser) {
      this.navCtrl.navigateRoot('');
    }
  }

  login() {
    this.httpClient.get('api/fetch/getUserByUsername?username=' + this.username).subscribe(user => {
      this.authService.loggedUser = <User>user;
      this.logged.next();
    });
  }

  signup() {
    this.showUserCreate = true;
    this.user = new User();
  }

}
