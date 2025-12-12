import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from "../shared/services/auth/auth.service";

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string = 'Home';
  private activatedRoute = inject(ActivatedRoute);

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string;
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.authService.loggedUser = null;
      window.location.reload();
    });
  }
}
