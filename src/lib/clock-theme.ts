export const CLOCK_THEMES = ["classic", "simple", "countdown", "script"] as const;

export type ClockTheme = (typeof CLOCK_THEMES)[number];

export const DEFAULT_CLOCK_THEME: ClockTheme = "classic";

export const CLOCK_THEME_LABELS: Record<ClockTheme, { en: string; fa: string }> = {
  classic: { en: "Default", fa: "پیش‌فرض" },
  simple: { en: "Classic", fa: "کلاسیک" },
  countdown: { en: "Countdown", fa: "شمارش معکوس" },
  script: { en: "Script", fa: "خوش‌نویس" },
};

export function parseClockTheme(value: string | null): ClockTheme {
  if (value === "neon") return "countdown";
  if (value === "simple" || value === "countdown" || value === "script" || value === "classic") {
    return value;
  }
  return DEFAULT_CLOCK_THEME;
}

export function isOverlayClockTheme(theme: ClockTheme): boolean {
  return theme !== "classic";
}
