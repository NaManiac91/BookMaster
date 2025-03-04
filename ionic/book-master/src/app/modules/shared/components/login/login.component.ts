import {HttpClient} from '@angular/common/http';
import {Component, OnInit, Output} from '@angular/core';
import {SecurityService} from '../../services/security/security.service';
import {User} from '../../rest-api-client';
import {Subject} from 'rxjs';
import {NavController} from "@ionic/angular";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  username!: string;
  password!: string;

  @Output() logged: Subject<void> = new Subject<void>();

  constructor(private httpClient: HttpClient,
              private securityService: SecurityService,
              private navCtrl: NavController) {
  }

  ngOnInit() {
    if (this.securityService.loggedUser) {
      this.navCtrl.navigateRoot('');
    }
  }

  login() {
    this.httpClient.get('api/fetch/getUserByUsername?username=' + this.username).subscribe(user => {
      this.securityService.loggedUser = <User>user;
      this.logged.next();
    });
  }

}
