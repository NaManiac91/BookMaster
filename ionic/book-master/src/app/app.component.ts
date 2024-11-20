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
    { title: 'Home', url: '/Home', icon: 'home' },
    { title: 'Create', url: '/Create', icon: 'create' },
    { title: 'Favorites', url: '/Favorites', icon: 'heart' },
    { title: 'Archived', url: '/Archived', icon: 'archive' },
    { title: 'Trash', url: '/Trash', icon: 'trash' },
    { title: 'Spam', url: '/Spam', icon: 'warning' },
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
