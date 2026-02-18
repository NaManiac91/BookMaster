import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import localeIt from '@angular/common/locales/it';

import { AppModule } from './app/app.module';

// Register locale data used by DatePipe when language switches at runtime.
registerLocaleData(localeFr, 'fr');
registerLocaleData(localeFr, 'fr-FR');
registerLocaleData(localeIt, 'it');
registerLocaleData(localeIt, 'it-IT');

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
