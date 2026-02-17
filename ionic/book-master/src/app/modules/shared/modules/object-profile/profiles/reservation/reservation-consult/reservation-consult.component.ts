import {Component} from '@angular/core';
import {ObjectProfileView} from "../../../../../enum";
import {Reservation} from "../../../../../rest-api-client";
import {ObjectProfile} from "../../../services/object-profile.service";

@ObjectProfile({
  view: [ObjectProfileView.CONSULT, ObjectProfileView.CREATE],
  type: Reservation
})
@Component({
  selector: 'app-reservation-consult',
  templateUrl: './reservation-consult.component.html',
  styleUrls: ['./reservation-consult.component.scss'],
})
export class ReservationConsultComponent {
  object!: Reservation;
  view: ObjectProfileView = ObjectProfileView.CONSULT;

  get readonly(): boolean {
    return this.view === ObjectProfileView.CONSULT;
  }

  get durationMinutes(): number | null {
    const requiredSlots = Number(this.object?.service?.time)
      || this.object?.slots?.split(',').filter(Boolean).length
      || 1;
    const blockMinutes = Number(this.object?.providerTimeBlockMinutes);
    if (!blockMinutes || blockMinutes <= 0) {
      return null;
    }
    return requiredSlots * blockMinutes;
  }
}
