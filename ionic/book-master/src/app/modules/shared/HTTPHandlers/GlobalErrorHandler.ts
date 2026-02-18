import {ErrorHandler, Injectable, NgZone} from "@angular/core";
import {AlertController} from "@ionic/angular";
import {HttpErrorResponse} from "@angular/common/http";
import {TranslationService} from "../modules/translation/services/translation.service";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(
    private alertController: AlertController,
    private zone: NgZone,
    private translationService: TranslationService
  ) {
  }

  async presentAlert(error: HttpErrorResponse) {
    const alert = await this.alertController.create({
      header: error?.name,
      subHeader: error?.statusText,
      message: error?.message || this.translationService.translate('error.undefinedClientError'),
      buttons: [this.translationService.translate('common.ok')],
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
