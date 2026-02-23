import {IModel, Provider, Service, User} from "../rest-api-client";
import {toMinutesOfDay} from "./date-time.utils";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function hasText(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

export function isValidEmail(value: unknown): boolean {
  return hasText(value) && EMAIL_REGEX.test(String(value).trim());
}

function hasValidProviderTimeRange(provider: Provider): boolean {
  const startMinutes = toMinutesOfDay(provider.startTime);
  const endMinutes = toMinutesOfDay(provider.endTime);

  if (startMinutes == null || endMinutes == null) {
    return true;
  }

  return endMinutes > startMinutes;
}

function hasValidProviderTimeBlock(provider: Provider): boolean {
  if (provider.timeBlockMinutes === undefined || provider.timeBlockMinutes === null) {
    return true;
  }

  const timeBlockMinutes = Number(provider.timeBlockMinutes);
  return Number.isFinite(timeBlockMinutes) && timeBlockMinutes > 0 && timeBlockMinutes <= 60;
}

export function isValidProvider(provider: Provider | null | undefined): boolean {
  if (!provider) {
    return false;
  }

  const address = provider.address;
  const hasRequiredAddress = !!address
    && hasText(address.street)
    && hasText(address.city)
    && hasText(address.postalCode)
    && hasText(address.country);

  const hasValidEmail = !hasText(provider.email) || isValidEmail(provider.email);

  return hasText(provider.name)
    && hasRequiredAddress
    && hasValidEmail
    && hasValidProviderTimeRange(provider)
    && hasValidProviderTimeBlock(provider);
}

export function isValidService(service: Service | null | undefined): boolean {
  if (!service) {
    return false;
  }

  const price = Number(service.price);
  const durationSlots = Number(service.time);

  return hasText(service.name)
    && Number.isFinite(price)
    && price >= 0
    && Number.isFinite(durationSlots)
    && Number.isInteger(durationSlots)
    && durationSlots > 0;
}

export function isValidUser(user: User | null | undefined): boolean {
  if (!user) {
    return false;
  }

  if (!hasText(user.username) || !isValidEmail(user.email)) {
    return false;
  }

  if (user.provider) {
    return isValidProvider(user.provider);
  }

  return true;
}

export function isValidModel(model: IModel | null | undefined): boolean {
  if (!model) {
    return false;
  }

  switch (model.$t) {
    case User.$t:
      return isValidUser(model as User);
    case Provider.$t:
      return isValidProvider(model as Provider);
    case Service.$t:
      return isValidService(model as Service);
    default:
      return true;
  }
}
