import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {finalize, Observable} from "rxjs";
import {LoadingController} from "@ionic/angular";

@Injectable()
export class HttpLoadingInterceptor implements HttpInterceptor {
  private loading: HTMLIonLoadingElement;

  constructor(private loadingController: LoadingController) { }

  async showLoading(message: string = 'Please wait...') {
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
