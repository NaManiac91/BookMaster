import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from "../shared/services/auth/auth.service";
import { MenuController, NavController } from "@ionic/angular";
import { ObjectProfileView } from "../shared/enum";

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string = 'Home';
  private activatedRoute = inject(ActivatedRoute);

  constructor(private authService: AuthService,
              private menuController: MenuController,
              private navCtrl: NavController,
              private router: Router) {
  }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string;
  }

  get folderTitleKey(): string {
    switch (this.folder) {
      case 'Home':
        return 'menu.home';
      case 'ReservationWorkflow':
      case 'Providers':
        return 'menu.providers';
      case 'ReservationHistory':
        return 'menu.history';
      default:
        return this.folder;
    }
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.authService.loggedUser = null;
      window.location.reload();
    });
  }

  async openAccount() {
    await this.menuController.close('folder-side-menu');
    const user = this.authService.loggedUser;
    if (!user) {
      return;
    }

    await this.router.navigate(['Editor'], {
      queryParams: {
        context: Date.now()
      },
      state: {
        object: user,
        view: ObjectProfileView.EDIT
      }
    });
  }

  async openHistory() {
    await this.menuController.close('folder-side-menu');
    this.navCtrl.navigateRoot('ReservationHistory');
  }
}
