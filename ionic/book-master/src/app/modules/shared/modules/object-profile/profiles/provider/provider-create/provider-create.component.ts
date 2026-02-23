import {Component, Input} from '@angular/core';
import {
  ObjectProfile,
} from "../../../services/object-profile.service";
import {Address, Provider} from "../../../../../rest-api-client";
import {ObjectProfileView, ProviderType} from "../../../../../enum";
import {
  normalizeProviderClosedDates,
  normalizeProviderClosedDays,
  PROVIDER_WEEKDAY_OPTIONS,
  ProviderWeekdayOption
} from "../../../../../utils/provider-weekday.utils";

@ObjectProfile({
  view: [ObjectProfileView.CREATE, ObjectProfileView.EDIT],
  type: Provider
})
@Component({
  selector: 'app-provider-create',
  templateUrl: './provider-create.component.html',
  styleUrls: ['./provider-create.component.scss'],
})
export class ProviderCreateComponent {
  private _object!: Provider;
  @Input() set object(value: Provider) {
    this._object = value;
    if (this._object && !this._object.address) {
      this._object.address = new Address();
    }
    if (this._object) {
      this._object.closedDays = normalizeProviderClosedDays(this._object.closedDays);
      this._object.closedDates = normalizeProviderClosedDates(this._object.closedDates);
    }
  }

  get object(): Provider {
    return this._object;
  }

  types = Object.values(ProviderType).filter(v => !Number.isFinite(v));
  closedDayOptions: ProviderWeekdayOption[] = PROVIDER_WEEKDAY_OPTIONS;
  specialClosureDateInput: string = '';

  constructor() { }

  get specialClosedDates(): string[] {
    return normalizeProviderClosedDates(this.object?.closedDates);
  }

  addSpecialClosedDate() {
    const nextDate = normalizeProviderClosedDates([this.specialClosureDateInput]);
    if (!nextDate.length) {
      return;
    }

    const currentDates = normalizeProviderClosedDates(this.object?.closedDates);
    this.object.closedDates = Array.from(new Set([...currentDates, nextDate[0]])).sort();
    this.specialClosureDateInput = '';
  }

  removeSpecialClosedDate(dateIso: string) {
    const currentDates = normalizeProviderClosedDates(this.object?.closedDates);
    this.object.closedDates = currentDates.filter((date) => date !== dateIso);
  }

  protected readonly Address = Address;
}
