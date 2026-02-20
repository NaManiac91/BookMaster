import { Injectable } from '@angular/core';
import { Provider, Reservation } from '../../../shared/rest-api-client';
import {
  availabilityRatioToDotLevel,
  calculateMaxSlotsPerDay,
  CalendarDotLevel,
  isFutureOrToday,
  toISODateString
} from "../../../shared/utils/date-time.utils";

export interface ProviderAvailabilityLevels {
  maxSlotsPerDay: number;
  defaultDotLevel: CalendarDotLevel;
  dotLevelsByDate: Record<string, CalendarDotLevel>;
}

@Injectable({
  providedIn: 'root'
})
export class ProviderReservationCalendarService {
  buildAvailabilityLevels(reservations: Reservation[], provider?: Provider): ProviderAvailabilityLevels {
    const maxSlotsPerDay = calculateMaxSlotsPerDay(
      provider?.startTime,
      provider?.endTime,
      Number(provider?.timeBlockMinutes)
    );
    const defaultDotLevel: CalendarDotLevel = maxSlotsPerDay > 0 ? 'high' : 'none';
    const usedSlotsByDate: Record<string, number> = {};

    for (const reservation of reservations || []) {
      if (!isFutureOrToday(reservation.date)) {
        continue;
      }

      const isoDate = toISODateString(new Date(reservation.date));
      usedSlotsByDate[isoDate] = (usedSlotsByDate[isoDate] || 0) + this.countUsedSlots(reservation);
    }

    const dotLevelsByDate: Record<string, CalendarDotLevel> = {};
    for (const isoDate of Object.keys(usedSlotsByDate)) {
      dotLevelsByDate[isoDate] = this.toDotLevel(usedSlotsByDate[isoDate], maxSlotsPerDay);
    }

    return {
      maxSlotsPerDay,
      defaultDotLevel,
      dotLevelsByDate
    };
  }

  private countUsedSlots(reservation: Reservation): number {
    const slotList = (reservation?.slots || '')
      .split(',')
      .map(slot => slot.trim())
      .filter(Boolean);
    if (slotList.length > 0) {
      return slotList.length;
    }

    if (Array.isArray(reservation?.listSlot) && reservation.listSlot.length > 0) {
      return reservation.listSlot.length;
    }

    const serviceSlots = Number(reservation?.service?.time);
    if (Number.isFinite(serviceSlots) && serviceSlots > 0) {
      return serviceSlots;
    }

    return 1;
  }

  private toDotLevel(usedSlots: number, maxSlotsPerDay: number): CalendarDotLevel {
    if (maxSlotsPerDay <= 0) {
      return 'none';
    }

    const availabilityRatio = 1 - Math.min(1, Math.max(0, usedSlots / maxSlotsPerDay));
    return availabilityRatioToDotLevel(availabilityRatio);
  }
}
