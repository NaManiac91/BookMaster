import {ErrorHandler, Injectable, NgZone} from "@angular/core";
import {AlertController} from "@ionic/angular";
import {HttpErrorResponse} from "@angular/common/http";
import {TranslationService} from "../modules/translation/services/translation.service";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private isPresentingAlert = false;
  private isHandlingError = false;

  constructor(
    private alertController: AlertController,
    private zone: NgZone,
    private translationService: TranslationService
  ) {
  }

  async presentAlert(error: HttpErrorResponse) {
    if (this.isPresentingAlert) {
      return;
    }

    this.isPresentingAlert = true;
    try {
      const alert = await this.alertController.create({
        header: error?.name,
        subHeader: error?.statusText,
        message: error?.message || this.translationService.translate('error.undefinedClientError'),
        buttons: [this.translationService.translate('common.ok')],
      });

      await alert.present();
    } catch (alertError) {
      console.warn('Error while presenting global alert', alertError);
    } finally {
      this.isPresentingAlert = false;
    }
  }

  handleError(error: unknown) {
    if (this.isHandlingError) {
      return;
    }

    this.isHandlingError = true;
    try {
    const httpError = this.resolveHttpError(error);
    if (httpError) {
      this.zone.run(() => {
        void this.presentAlert(httpError);
      });
    }

    console.error('Error from global error handler', error);
    } finally {
      this.isHandlingError = false;
    }
  }

  private resolveHttpError(error: unknown): HttpErrorResponse | null {
    if (error instanceof HttpErrorResponse) {
      return error;
    }

    const wrappedError = (error as any)?.rejection;
    if (wrappedError instanceof HttpErrorResponse) {
      return wrappedError;
    }

    return null;
  }
}
