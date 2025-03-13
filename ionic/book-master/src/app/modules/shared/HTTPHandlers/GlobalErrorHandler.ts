import {ErrorHandler, Injectable, NgZone} from "@angular/core";
import {AlertController} from "@ionic/angular";
import {HttpErrorResponse} from "@angular/common/http";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(
    private alertController: AlertController,
    private zone: NgZone
  ) {
  }

  async presentAlert(error: HttpErrorResponse) {
    const alert = await this.alertController.create({
      header: error?.name,
      subHeader: error?.statusText,
      message: error?.message || 'Undefined client error',
      buttons: ['OK'],
    });

    await alert.present();
  }

  handleError(error: HttpErrorResponse) {
    // Check if it's an error from an HTTP response
    this.zone.run(() =>
      this.presentAlert(error)
    );

    console.error('Error from global error handler', error);
  }
}

