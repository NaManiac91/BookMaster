export type CalendarDotLevel = 'none' | 'low' | 'medium' | 'high';
export const CALENDAR_HIGH_RATIO_THRESHOLD = 0.66;
export const CALENDAR_MEDIUM_RATIO_THRESHOLD = 0.33;

export interface CalendarDayCell {
  date: Date;
  isoDate: string;
  selectable: boolean;
}

export function toISODateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function resolveLocale(language?: string | null): string {
  switch ((language || '').toLowerCase()) {
    case 'it':
      return 'it-IT';
    case 'fr':
      return 'fr-FR';
    default:
      return 'en-US';
  }
}

export function isFutureOrToday(dateValue: Date | string | number): boolean {
  const reservationDate = new Date(dateValue);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  reservationDate.setHours(0, 0, 0, 0);
  return reservationDate >= today;
}

export function buildMonthCalendarCells(
  monthDate: Date,
  todayIsoDate: string
): Array<CalendarDayCell | null> {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const mondayBasedOffset = (firstOfMonth.getDay() + 6) % 7;
  const cells: Array<CalendarDayCell | null> = Array.from({ length: mondayBasedOffset }, () => null);

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const isoDate = toISODateString(date);
    cells.push({
      date,
      isoDate,
      selectable: isoDate >= todayIsoDate
    });
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
}

export function availabilityRatioToDotLevel(ratio: number): CalendarDotLevel {
  const normalized = Math.min(1, Math.max(0, ratio));
  if (normalized >= CALENDAR_HIGH_RATIO_THRESHOLD) {
    return 'high';
  }
  if (normalized >= CALENDAR_MEDIUM_RATIO_THRESHOLD) {
    return 'medium';
  }
  if (normalized > 0) {
    return 'low';
  }
  return 'none';
}

export function toMinutesOfDay(value: Date | string | number | undefined): number | null {
  if (value === undefined || value === null) {
    return null;
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.getHours() * 60 + value.getMinutes();
  }

  if (typeof value === 'number') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed.getHours() * 60 + parsed.getMinutes();
  }

  const text = String(value).trim();
  const hhmmMatch = text.match(/^(\d{1,2}):(\d{2})/);
  if (hhmmMatch) {
    const hours = Number(hhmmMatch[1]);
    const minutes = Number(hhmmMatch[2]);
    if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
      return hours * 60 + minutes;
    }
    return null;
  }

  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? null : parsed.getHours() * 60 + parsed.getMinutes();
}

export function calculateMaxSlotsPerDay(
  startTime: Date | string | number | undefined,
  endTime: Date | string | number | undefined,
  timeBlockMinutes: number
): number {
  const slotMinutes = Number(timeBlockMinutes);
  if (!Number.isFinite(slotMinutes) || slotMinutes <= 0) {
    return 0;
  }

  const startMinutes = toMinutesOfDay(startTime);
  const endMinutes = toMinutesOfDay(endTime);
  if (startMinutes == null || endMinutes == null) {
    return 0;
  }

  const rangeMinutes = endMinutes - startMinutes;
  if (rangeMinutes <= 0) {
    return 0;
  }

  return Math.floor(rangeMinutes / slotMinutes);
}
