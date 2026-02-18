import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {finalize, Observable} from "rxjs";
import {LoadingController} from "@ionic/angular";
import {TranslationService} from "../modules/translation/services/translation.service";

@Injectable()
export class HttpLoadingInterceptor implements HttpInterceptor {
  private loading: HTMLIonLoadingElement;

  constructor(private loadingController: LoadingController,
              private translationService: TranslationService) { }

  async showLoading(message: string = this.translationService.translate('loading.pleaseWait')) {
    this.loading = await this.loadingController.create({
      message: message,
      spinner: 'circles', // You can change the spinner type
      duration: 2000, // Optional: Set a duration if you want it to auto-dismiss
    });

    await this.loading.present();
  }

  async hideLoading() {
    if (this.loading) {
      await this.loading.dismiss();
    }
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.showLoading();
    return next.handle(request).pipe(
      finalize(() => {
        this.hideLoading();
      })
    ) as Observable<HttpEvent<any>>;
  }
}
