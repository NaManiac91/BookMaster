import { HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { LoadingController } from '@ionic/angular';

import { HttpLoadingInterceptor } from './HttpLoadingInterceptor';
import { TranslationService } from '../modules/translation/services/translation.service';

describe('HttpLoadingInterceptor', () => {
  let interceptor: HttpLoadingInterceptor;
  let loadingController: jasmine.SpyObj<LoadingController>;
  let translationService: jasmine.SpyObj<TranslationService>;

  beforeEach(() => {
    loadingController = jasmine.createSpyObj<LoadingController>('LoadingController', ['create']);
    translationService = jasmine.createSpyObj<TranslationService>('TranslationService', ['translate']);
    translationService.translate.and.returnValue('Please wait...');
    interceptor = new HttpLoadingInterceptor(loadingController, translationService);
  });

  it('showLoading creates and presents loading indicator', async () => {
    const loadingElement = jasmine.createSpyObj('HTMLIonLoadingElement', ['present', 'dismiss']);
    loadingController.create.and.resolveTo(loadingElement as any);

    await interceptor.showLoading();

    expect(loadingController.create).toHaveBeenCalledWith({
      message: 'Please wait...',
      spinner: 'circles',
      duration: 2000
    });
    expect(loadingElement.present).toHaveBeenCalled();
  });

  it('hideLoading dismisses the loading indicator when present', async () => {
    const loadingElement = jasmine.createSpyObj('HTMLIonLoadingElement', ['present', 'dismiss']);
    (interceptor as any).loading = loadingElement;

    await interceptor.hideLoading();

    expect(loadingElement.dismiss).toHaveBeenCalled();
  });

  it('hideLoading does nothing when loading is not initialized', async () => {
    await expectAsync(interceptor.hideLoading()).toBeResolved();
  });

  it('intercept triggers show and hide around request lifecycle', () => {
    const showSpy = spyOn(interceptor, 'showLoading').and.returnValue(Promise.resolve());
    const hideSpy = spyOn(interceptor, 'hideLoading').and.returnValue(Promise.resolve());
    const request = new HttpRequest('GET', '/api/test');
    const next: HttpHandler = {
      handle: () => of(new HttpResponse({ status: 200 }))
    };

    interceptor.intercept(request, next).subscribe();

    expect(showSpy).toHaveBeenCalled();
    expect(hideSpy).toHaveBeenCalled();
  });
});
