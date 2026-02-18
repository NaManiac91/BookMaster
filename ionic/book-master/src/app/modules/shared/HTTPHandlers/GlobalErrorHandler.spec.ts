import { NgZone } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertController } from '@ionic/angular';

import { GlobalErrorHandler } from './GlobalErrorHandler';
import { TranslationService } from '../modules/translation/services/translation.service';

describe('GlobalErrorHandler', () => {
  let handler: GlobalErrorHandler;
  let alertController: jasmine.SpyObj<AlertController>;
  let translationService: jasmine.SpyObj<TranslationService>;
  let zone: NgZone;

  beforeEach(() => {
    alertController = jasmine.createSpyObj<AlertController>('AlertController', ['create']);
    translationService = jasmine.createSpyObj<TranslationService>('TranslationService', ['translate']);
    translationService.translate.and.callFake((key: string) => {
      if (key === 'error.undefinedClientError') {
        return 'Undefined client error';
      }
      if (key === 'common.ok') {
        return 'OK';
      }
      return key;
    });
    zone = {
      run: <T>(fn: (...args: any[]) => T): T => fn()
    } as NgZone;

    handler = new GlobalErrorHandler(alertController, zone, translationService);
  });

  it('presentAlert creates and presents alert with HTTP error details', async () => {
    const alertElement = jasmine.createSpyObj('HTMLIonAlertElement', ['present']);
    alertController.create.and.resolveTo(alertElement as any);

    const error = new HttpErrorResponse({
      status: 500,
      statusText: 'Server Error',
      error: 'boom',
      url: '/api/test'
    });

    await handler.presentAlert(error);

    expect(alertController.create).toHaveBeenCalledWith({
      header: error.name,
      subHeader: error.statusText,
      message: error.message || 'Undefined client error',
      buttons: ['OK']
    });
    expect(alertElement.present).toHaveBeenCalled();
  });

  it('handleError runs alert presentation inside zone and logs error', () => {
    const error = new HttpErrorResponse({ status: 400, statusText: 'Bad Request' });
    const presentSpy = spyOn(handler, 'presentAlert').and.returnValue(Promise.resolve());
    const consoleSpy = spyOn(console, 'error');
    const runSpy = spyOn(zone, 'run').and.callThrough();

    handler.handleError(error);

    expect(runSpy).toHaveBeenCalled();
    expect(presentSpy).toHaveBeenCalledWith(error);
    expect(consoleSpy).toHaveBeenCalledWith('Error from global error handler', error);
  });
});
