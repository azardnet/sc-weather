import { TO_FIXED, UNIT } from "./constants";
import { NumbersToPersian } from "./utils";

export function formatTemp(value: number, isPersian: boolean): string {
  const fixed = Number(value).toFixed(TO_FIXED);
  return isPersian ? NumbersToPersian(fixed) : fixed;
}

export function formatHumidity(value: number, isPersian: boolean): string | number {
  return isPersian ? NumbersToPersian(value) : value;
}

export { UNIT };
