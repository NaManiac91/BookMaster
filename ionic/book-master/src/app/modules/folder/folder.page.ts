import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SecurityService} from "../shared/services/security/security.service";

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string = 'Home';
  private activatedRoute = inject(ActivatedRoute);

  constructor(private securityService: SecurityService) {
  }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string;
  }

  logout() {
    this.securityService.loggedUser = null;
    window.location.reload();
  }
}
