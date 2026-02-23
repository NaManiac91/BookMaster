import {Component} from '@angular/core';
import {ObjectProfileView} from '../../../../../enum';
import {Provider} from '../../../../../rest-api-client';
import {ObjectProfile} from '../../../services/object-profile.service';
import {normalizeProviderClosedDates, toClosedWeekdayTranslationKeys} from "../../../../../utils/provider-weekday.utils";

@ObjectProfile({
  view: ObjectProfileView.INFO,
  type: Provider
})
@Component({
  selector: 'app-provider-reservation-info',
  templateUrl: './provider-reservation-info.component.html',
  styleUrls: ['./provider-reservation-info.component.scss'],
})
export class ProviderReservationInfoComponent {
  object!: Provider;

  get hasAddress(): boolean {
    const address = this.object?.address;
    return !!(address?.street || address?.city || address?.postalCode || address?.country);
  }

  get mapsUrl(): string {
    const address = this.object?.address;
    const fullAddress = [
      address?.street,
      [address?.postalCode, address?.city].filter(Boolean).join(' '),
      address?.country
    ].filter(Boolean).join(', ');

    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
  }

  get phoneHref(): string {
    const phone = (this.object?.phone || '').replace(/\s+/g, '');
    return `tel:${phone}`;
  }

  get mailHref(): string {
    return `mailto:${this.object?.email || ''}`;
  }

  get closedDayTranslationKeys(): string[] {
    return toClosedWeekdayTranslationKeys(this.object?.closedDays);
  }

  get closedDateIsoValues(): string[] {
    return normalizeProviderClosedDates(this.object?.closedDates);
  }
}
