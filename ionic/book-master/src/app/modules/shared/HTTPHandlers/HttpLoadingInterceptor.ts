import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {finalize, Observable} from "rxjs";
import {LoadingController} from "@ionic/angular";
import {TranslationService} from "../modules/translation/services/translation.service";

@Injectable()
export class HttpLoadingInterceptor implements HttpInterceptor {
  private loading?: HTMLIonLoadingElement;
  private loadingPromise?: Promise<void>;
  private activeRequests = 0;

  constructor(private loadingController: LoadingController,
              private translationService: TranslationService) { }

  async showLoading(message: string = this.translationService.translate('loading.pleaseWait')) {
    if (this.loading) {
      return;
    }

    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    this.loadingPromise = (async () => {
      const loading = await this.loadingController.create({
        message,
        spinner: 'circles',
      });

      this.loading = loading;
      await loading.present();
    })()
      .catch(() => {
        this.loading = undefined;
      })
      .finally(() => {
        this.loadingPromise = undefined;
      });

    return this.loadingPromise;
  }

  async hideLoading() {
    if (this.loadingPromise) {
      await this.loadingPromise;
    }

    const loading = this.loading;
    this.loading = undefined;

    if (!loading) {
      return;
    }

    try {
      await loading.dismiss();
    } catch (_error) {
      // Ignore dismiss errors when the overlay has already been removed.
    }
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.activeRequests++;
    if (this.activeRequests === 1) {
      void this.showLoading();
    }

    return next.handle(request).pipe(
      finalize(() => {
        this.activeRequests = Math.max(0, this.activeRequests - 1);
        if (this.activeRequests === 0) {
          void this.hideLoading();
        }
      })
    ) as Observable<HttpEvent<any>>;
  }
}
