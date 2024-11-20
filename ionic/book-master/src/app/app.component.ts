import { Component, inject } from '@angular/core';
import { SecurityService } from './modules/shared/services/security.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Create', url: '/create', icon: 'create' },
    { title: 'Favorites', url: '/favorites', icon: 'heart' },
    { title: 'Archived', url: '/archived', icon: 'archive' },
    { title: 'Trash', url: '/trash', icon: 'trash' },
    { title: 'Spam', url: '/spam', icon: 'warning' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  
  isLogged: boolean = false;

  constructor(private securityService: SecurityService) { }

  ngOnInit() {
    if (this.securityService.loggedUser) {
      this.isLogged = true;
    } 
  }
}
