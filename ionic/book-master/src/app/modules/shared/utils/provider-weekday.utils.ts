import {toISODateString} from "./date-time.utils";

export interface ProviderWeekdayOption {
  value: string;
  translationKey: string;
  jsDayIndex: number;
}

export const PROVIDER_WEEKDAY_OPTIONS: ProviderWeekdayOption[] = [
  { value: 'MONDAY', translationKey: 'weekday.mon', jsDayIndex: 1 },
  { value: 'TUESDAY', translationKey: 'weekday.tue', jsDayIndex: 2 },
  { value: 'WEDNESDAY', translationKey: 'weekday.wed', jsDayIndex: 3 },
  { value: 'THURSDAY', translationKey: 'weekday.thu', jsDayIndex: 4 },
  { value: 'FRIDAY', translationKey: 'weekday.fri', jsDayIndex: 5 },
  { value: 'SATURDAY', translationKey: 'weekday.sat', jsDayIndex: 6 },
  { value: 'SUNDAY', translationKey: 'weekday.sun', jsDayIndex: 0 }
];

const OPTIONS_BY_VALUE = new Map<string, ProviderWeekdayOption>(
  PROVIDER_WEEKDAY_OPTIONS.map((option) => [option.value, option])
);

export function normalizeProviderClosedDays(days: string[] | null | undefined): string[] {
  const normalized = (days || [])
    .map((day) => String(day || '').trim().toUpperCase())
    .filter((day) => OPTIONS_BY_VALUE.has(day));
  return Array.from(new Set(normalized));
}

export function toClosedWeekdayTranslationKeys(days: string[] | null | undefined): string[] {
  return normalizeProviderClosedDays(days)
    .map((day) => OPTIONS_BY_VALUE.get(day)?.translationKey)
    .filter((value): value is string => !!value);
}

export function toClosedWeekdayJsIndexes(days: string[] | null | undefined): number[] {
  const indexes = normalizeProviderClosedDays(days)
    .map((day) => OPTIONS_BY_VALUE.get(day)?.jsDayIndex)
    .filter((value): value is number => value !== undefined);
  return Array.from(new Set(indexes));
}

function toIsoDateString(value: unknown): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return toISODateString(value);
  }

  if (typeof value === 'number') {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : toISODateString(date);
  }

  const text = String(value).trim();
  if (!text) {
    return null;
  }

  const isoMatch = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const year = Number(isoMatch[1]);
    const month = Number(isoMatch[2]);
    const day = Number(isoMatch[3]);
    const date = new Date(year, month - 1, day);
    return toISODateString(date) === text ? text : null;
  }

  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? null : toISODateString(parsed);
}

export function normalizeProviderClosedDates(dates: unknown[] | null | undefined): string[] {
  const normalized = (dates || [])
    .map((dateValue) => toIsoDateString(dateValue))
    .filter((dateValue): dateValue is string => !!dateValue);
  return Array.from(new Set(normalized)).sort();
}
