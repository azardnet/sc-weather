export interface JalaliDate {
  year: number;
  month: number;
  day: number;
}

export const JALALI_MONTHS = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
] as const;

export const JALALI_WEEKDAYS = ["ش", "ی", "د", "س", "چ", "پ", "ج"] as const;

function truncDiv(value: number, divisor: number): number {
  return Math.trunc(value / divisor);
}

export function gregorianToJalali(gy: number, gm: number, gd: number): JalaliDate {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  const gy2 = gm > 2 ? gy + 1 : gy;
  let days =
    355666 +
    365 * gy +
    truncDiv(gy2 + 3, 4) -
    truncDiv(gy2 + 99, 100) +
    truncDiv(gy2 + 399, 400) +
    gd +
    g_d_m[gm - 1];
  let year = -1595 + 33 * truncDiv(days, 12053);
  days %= 12053;
  year += 4 * truncDiv(days, 1461);
  days %= 1461;
  if (days > 365) {
    year += truncDiv(days - 1, 365);
    days = (days - 1) % 365;
  }
  const month = days < 186 ? 1 + truncDiv(days, 31) : 7 + truncDiv(days - 186, 30);
  const day = 1 + (days < 186 ? days % 31 : (days - 186) % 30);
  return { year, month, day };
}

export function jalaliToGregorian(jy: number, jm: number, jd: number): JalaliDate {
  const yearShifted = jy + 1595;
  let days =
    -355668 +
    365 * yearShifted +
    truncDiv(yearShifted, 33) * 8 +
    truncDiv((yearShifted % 33) + 3, 4) +
    jd +
    (jm < 7 ? (jm - 1) * 31 : (jm - 7) * 30 + 186);
  let gy = 400 * truncDiv(days, 146097);
  days %= 146097;
  if (days > 36524) {
    days -= 1;
    gy += 100 * truncDiv(days, 36524);
    days %= 36524;
    if (days >= 365) days += 1;
  }
  gy += 4 * truncDiv(days, 1461);
  days %= 1461;
  if (days > 365) {
    gy += truncDiv(days - 1, 365);
    days = (days - 1) % 365;
  }
  let gd = days + 1;
  const leap = (gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0 ? 29 : 28;
  const sal_a = [0, 31, leap, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let gm = 0;
  for (; gm < 13 && gd > sal_a[gm]; gm += 1) {
    gd -= sal_a[gm];
  }
  return { year: gy, month: gm, day: gd };
}

export function jalaliMonthLength(year: number, month: number): number {
  if (month <= 6) return 31;
  if (month <= 11) return 30;
  const greg = jalaliToGregorian(year, 12, 30);
  const back = gregorianToJalali(greg.year, greg.month, greg.day);
  return back.year === year && back.month === 12 && back.day === 30 ? 30 : 29;
}

export function jalaliFromDate(date: Date): JalaliDate {
  return gregorianToJalali(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

export function dateFromJalali(
  year: number,
  month: number,
  day: number,
  hour = 0,
  minute = 0,
  second = 0,
): Date {
  const greg = jalaliToGregorian(year, month, day);
  return new Date(greg.year, greg.month - 1, greg.day, hour, minute, second, 0);
}

export function shiftJalaliMonth(
  year: number,
  month: number,
  delta: number,
): { year: number; month: number } {
  let nextYear = year;
  let nextMonth = month + delta;
  while (nextMonth > 12) {
    nextMonth -= 12;
    nextYear += 1;
  }
  while (nextMonth < 1) {
    nextMonth += 12;
    nextYear -= 1;
  }
  return { year: nextYear, month: nextMonth };
}

export function jalaliMonthStartWeekday(year: number, month: number): number {
  const date = dateFromJalali(year, month, 1);
  return (date.getDay() + 1) % 7;
}

export function isSameJalali(a: JalaliDate, b: JalaliDate): boolean {
  return a.year === b.year && a.month === b.month && a.day === b.day;
}
