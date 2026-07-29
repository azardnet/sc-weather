import { checkPersianCharacters } from "./utils";

export function parseHistory(raw: string | null): string[] {
  try {
    const parsed: unknown = JSON.parse(raw as string);
    if (Array.isArray(parsed)) return parsed.map(String);
    return parsed ? [String(parsed)] : [];
  } catch {
    return raw ? [raw] : [];
  }
}

export function cityFromStorage(raw: string | null): string | null {
  if (!raw) return null;
  try {
    const list: unknown = JSON.parse(raw);
    if (Array.isArray(list)) return String(list[list.length - 1]);
    return String(list);
  } catch {
    return raw;
  }
}

export function getLastCity(): string | null {
  return cityFromStorage(localStorage.getItem("last_search"));
}

export function isLastCityPersian(): boolean {
  return checkPersianCharacters(getLastCity());
}
